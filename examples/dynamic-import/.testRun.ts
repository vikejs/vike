import {
  run,
  page,
  test,
  expect,
  urlBase,
  fetchHtml,
  autoRetry,
  partRegex,
  editFile,
  editFileRevert,
  sleep
} from '@brillout/test-e2e'
import assert from 'assert'

export { testRun }

const HMR_SLEEP = 500

function testRun(cmd: 'npm run dev' | 'npm run preview') {
  run(cmd)

  const isPreview = cmd === 'npm run preview'

  const hash = /[a-z0-9]+/
  const path = /[^\>]+/

  test('SSR', async () => {
    {
      const html = await fetchHtml('/')
      expect(html).toContain('Rendered to HTML and hydrated in the browser.')
      testClientRouting(html)
    }

    await page.goto(urlBase)
    await clickCounter()
    expect(await page.textContent('button')).toContain('Counter 1')

    if (!isPreview) {
      expect(await page.textContent('button')).toContain('Counter 1')
      {
        expect(await page.textContent('h1')).toBe('Dynamic Import in SSR Render')
        await sleep(HMR_SLEEP)
        editFileRevert()
        await autoRetry(async () => {
          expect(await page.textContent('h1')).toBe('Dynamic Import in SSR Render')
        })
      }
      // Ensure HMR instead of page reload
      expect(await page.textContent('button')).toContain('Counter 1')
      {
        await testColor('blue')
        await sleep(HMR_SLEEP)
        editFile('./pages/index/index.css', (s) => s.replace('color: blue', 'color: gray'))
        await testColor('gray')
        await sleep(HMR_SLEEP)
        editFileRevert()
        await testColor('blue')
      }
      // Ensure HMR instead of page reload
      expect(await page.textContent('button')).toContain('Counter 1')
    }
  })

  return

  async function testColor(color: Color) {
    await autoRetry(async () => {
      const node = await page.$('.colored')
      expect(node).not.toBe(null)
      assert(node !== null)
      const titleColor = await page.evaluate((node) => getComputedStyle(node).color, node)
      expect(titleColor).toBe(getColorRgb(color))
    })
  }
  async function clickCounter() {
    await page.waitForFunction(() => window.document.body.textContent.includes('Counter')) // Wait until page has loaded
    expect(await page.textContent('button')).toContain('Counter 0')
    await autoRetry(async () => {
      await page.click('button')
      expect(await page.textContent('button')).toContain('Counter 1')
    })
  }
  function testClientRouting(html: string) {
    if (isPreview) {
      expect(html).toMatch(partRegex`<script type="module" src="/assets/entry-client-routing.${hash}.js" async>`)
    } else {
      expect(html).toMatch(
        partRegex`import("/@fs/${path}/vite-plugin-ssr/vite-plugin-ssr/dist/esm/client/router/entry.js");`
      )
    }
  }
}

type Color = 'black' | 'green' | 'blue' | 'gray' | 'red' | 'orange'
function getColorRgb(color: Color) {
  let rgbRed = 0
  let rgbGreen = 0
  let rgbBlue = 0
  if (color === 'green') {
    rgbGreen = 128
  }
  if (color === 'red') {
    rgbRed = 255
  }
  if (color === 'blue') {
    rgbBlue = 255
  }
  if (color === 'orange') {
    rgbRed = 255
    rgbGreen = 165
    rgbBlue = 0
  }
  if (color === 'gray') {
    rgbRed = 128
    rgbGreen = 128
    rgbBlue = 128
  }
  const rgb = `rgb(${String(rgbRed)}, ${String(rgbGreen)}, ${String(rgbBlue)})`
  return rgb
}
