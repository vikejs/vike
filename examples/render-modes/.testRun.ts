import {
  run,
  page,
  urlBase,
  fetchHtml,
  autoRetry,
  partRegex,
  editFile,
  editFileRevert,
  sleep,
} from '../../libframe/test/setup'
import assert from 'assert'

export { testRun }

function testRun(cmd: 'npm run dev' | 'npm run prod') {
  run(cmd)

  const isProd = cmd === 'npm run prod'

  const hash = /[a-z0-9]+/
  const path = /[^\>]+/

  test('HTML-only', async () => {
    const html = await fetchHtml('/html-only')
    expect(html).toContain('<h1>HTML-only</h1>')
    expect(html).toContain('This page has zero browser-side JavaScript.')
    if (isProd) {
      expect(html).not.toContain('<script')
      expect(html).toMatch(partRegex`<link rel="stylesheet" type="text/css" href="/assets/PageLayout.${hash}.css">`)
      expect(html).toMatch(
        partRegex`<link rel="stylesheet" type="text/css" href="/assets/index.page.server.${hash}.css">`,
      )
    } else {
      expect(html).toContain('<script')
      expect(html).toContain('@vite/client')
      expect(html).toContain('import RefreshRuntime from "/@react-refresh"')
      expect(html).toContain('<link rel="stylesheet" type="text/css" href="/renderer/PageLayout.css?direct">')
      expect(html).toContain('<link rel="stylesheet" type="text/css" href="/pages/html-only/index.css?direct">')
    }
    await page.goto(urlBase + '/html-only')
    await testColor('orange')
  })
  if (!isProd) {
    test('HTML-only - HMR', async () => {
      {
        expect(await page.textContent('h1')).toBe('HTML-only')
        editFile('./pages/html-only/index.page.server.jsx', (s) =>
          s.replace('<h1>HTML-only</h1>', '<h1>HTML-only !</h1>'),
        )
        // No HMR for HTML-only
        await page.waitForNavigation()
        // But auto reload works
        expect(await page.textContent('h1')).toBe('HTML-only !')
        editFileRevert()
      }
      {
        await testColor('orange')
        editFile('./pages/html-only/index.css', (s) => s.replace('color: orange', 'color: gray'))
        await testColor('gray')
        editFileRevert()
        await testColor('orange')
      }
    })
  }

  test('SPA', async () => {
    {
      const html = await fetchHtml('/spa')
      expect(html).not.toContain('h1')
      expect(html).toContain('<div id="react-container"></div>')
      testClientRouting(html)
    }

    await page.goto(urlBase + '/spa')
    await clickCounter()
  })
  if (!isProd) {
    test('SPA - HMR', async () => {
      expect(await page.textContent('button')).toContain('Counter 1')
      {
        expect(await page.textContent('h1')).toBe('SPA')
        editFile('./pages/spa/index.page.client.jsx', (s) => s.replace('<h1>SPA</h1>', '<h1>SPA !</h1>'))
        await autoRetry(async () => {
          expect(await page.textContent('h1')).toBe('SPA !')
        })
        editFileRevert()
        await autoRetry(async () => {
          expect(await page.textContent('h1')).toBe('SPA')
        })
      }
      // Ensure JavaScript was HMR'd
      expect(await page.textContent('button')).toContain('Counter 1')
      {
        await testColor('green')
        editFile('./pages/spa/index.css', (s) => s.replace('color: green', 'color: gray'))
        await testColor('gray')
        await sleep(100) // Avoid race condition
        editFileRevert()
        await testColor('green')
      }
      // Ensure CSS was HMR'd
      expect(await page.textContent('button')).toContain('Counter 1')
    })
  }

  test('HTML + JS', async () => {
    {
      const html = await fetchHtml('/html-js')
      expect(html).toContain('This page is rendered to HTML and has only few lines of browser-side JavaScript.')
      if (isProd) {
        expect(html).toMatch(partRegex`<script type="module" src="/assets/_default.page.client.${hash}.js" async>`)
      } else {
        expect(html).toMatch(partRegex`import "/@fs/${path}/pages/html-js/_default.page.client.js"`)
      }
    }

    await page.goto(urlBase + '/html-js')
    await clickCounter()
  })
  if (!isProd) {
    test('HTML + JS - HMR', async () => {
      {
        expect(await page.textContent('h1')).toBe('HTML + JS')
        editFile('./pages/html-js/index.page.server.jsx', (s) =>
          s.replace('<h1>HTML + JS</h1>', '<h1>HTML + JS !</h1>'),
        )
        // No HMR for HTML + JS
        await page.waitForNavigation()
        // But auto reload works
        expect(await page.textContent('h1')).toBe('HTML + JS !')
        editFileRevert()
      }
      {
        await testColor('red')
        editFile('./pages/html-js/index.css', (s) => s.replace('color: red', 'color: gray'))
        await testColor('gray')
        editFileRevert()
        await testColor('red')
      }
    })
  }

  test('SSR', async () => {
    {
      const html = await fetchHtml('/ssr')
      expect(html).toContain('Rendered to HTML and hydrated in the browser.')
      testClientRouting(html)
    }

    await page.goto(urlBase + '/ssr')
    await clickCounter()
  })
  if (!isProd) {
    test('SSR - HMR', async () => {
      expect(await page.textContent('button')).toContain('Counter 1')
      {
        expect(await page.textContent('h1')).toBe('SSR')
        editFile('./pages/ssr/index.page.jsx', (s) => s.replace('<h1>SSR</h1>', '<h1>SSR !</h1>'))
        await autoRetry(async () => {
          expect(await page.textContent('h1')).toBe('SSR !')
        })
        editFileRevert()
        await autoRetry(async () => {
          expect(await page.textContent('h1')).toBe('SSR')
        })
      }
      // Ensure HMR instead of page reload
      expect(await page.textContent('button')).toContain('Counter 1')
      {
        await testColor('blue')
        editFile('./pages/ssr/index.css', (s) => s.replace('color: blue', 'color: gray'))
        await testColor('gray')
        await sleep(100) // Avoid race condition
        editFileRevert()
        await testColor('blue')
      }
      // Ensure HMR instead of page reload
      expect(await page.textContent('button')).toContain('Counter 1')
    })
  }

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
    expect(await page.textContent('button')).toContain('Counter 0')
    await autoRetry(async () => {
      await page.click('button')
      expect(await page.textContent('button')).toContain('Counter 1')
    })
  }
  function testClientRouting(html: string) {
    if (isProd) {
      expect(html).toMatch(partRegex`<script type="module" src="/assets/entry-client-routing.${hash}.js" async>`)
    } else {
      expect(html).toMatch(
        partRegex`import "/@fs/${path}/vite-plugin-ssr/vite-plugin-ssr/dist/esm/client/router/entry.js"`,
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
