import {
  run,
  page,
  test,
  expect,
  getServerUrl,
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

// TODO:v1/release: remove non-V1 design case
function testRun(cmd: 'npm run dev' | 'npm run preview', isV1Design?: true) {
  run(cmd, { isFlaky: true })

  const isPreview = cmd === 'npm run preview'

  const hash = /[a-z0-9]+/
  const path = /[^\>]+/

  test('HTML-only', async () => {
    const html = await fetchHtml('/html-only')
    expect(html).toContain('<h1>HTML-only</h1>')
    expect(html).toContain('This page has zero browser-side JavaScript.')
    if (isPreview) {
      expect(html).not.toContain('<script')
      if (isV1Design) {
        const cssImport = isV1Design
          ? partRegex`<link rel="stylesheet" type="text/css" href="/assets/static/onRenderClient.${hash}.css">`
          : partRegex`<link rel="stylesheet" type="text/css" href="/assets/static/html-only.${hash}.css">`
        expect(html).toMatch(cssImport)
      } else {
        // Different test depending on Rollup version, see https://github.com/vitejs/vite/pull/13608#issuecomment-1606133506
        try {
          // rollup@3.21.0
          expect(html).toMatch(
            partRegex`<link rel="stylesheet" type="text/css" href="/assets/static/PageLayout.${hash}.css">`
          )
        } catch {
          // rollup@3.25.2
          expect(html).toMatch(
            partRegex`<link rel="stylesheet" type="text/css" href="/assets/static/default.page.server.${hash}.css">`
          )
        }
        expect(html).toMatch(
          partRegex`<link rel="stylesheet" type="text/css" href="/assets/static/index.page.server.${hash}.css">`
        )
      }
    } else {
      expect(html).toContain('<script')
      expect(html).toContain('@vite/client')
      expect(html).toContain('import RefreshRuntime from "/@react-refresh"')
      expect(html).toContain('<link rel="stylesheet" type="text/css" href="/renderer/PageLayout.css?direct">')
      expect(html).toContain('<link rel="stylesheet" type="text/css" href="/pages/html-only/index.css?direct">')
    }
    await page.goto(getServerUrl() + '/html-only')
    await testColor('orange')
  })
  if (!isPreview) {
    test('HTML-only - HMR', async () => {
      {
        {
          const viteClientConnected = page.waitForEvent('console', {
            predicate: (consoleMessage) => {
              const text = consoleMessage.text()
              return text === '[vite] connected.'
            }
          })
          await page.goto(getServerUrl() + '/html-only')
          expect(await page.textContent('h1')).toBe('HTML-only')
          await viteClientConnected
        }
        // No HMR for JavaScript
        {
          const navPromise = page.waitForNavigation()
          const file = isV1Design ? './pages/html-only/+Page.jsx' : './pages/html-only/index.page.server.jsx'
          editFile(file, (s) => s.replace('<h1>HTML-only</h1>', '<h1>HTML-only !</h1>'))
          await navPromise
          // But auto reload works
          expect(await page.textContent('h1')).toBe('HTML-only !')
        }
        {
          const navPromise = page.waitForNavigation()
          editFileRevert()
          await navPromise
          expect(await page.textContent('h1')).toBe('HTML-only')
        }
      }
      // HMR works for CSS
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

    await page.goto(getServerUrl() + '/spa')
    await clickCounter()

    expect(await page.textContent('button')).toContain('Counter 1')
    if (!isPreview) {
      {
        expect(await page.textContent('h1')).toBe('SPA')
        await sleep(HMR_SLEEP)
        const file = isV1Design ? './pages/spa/+Page.jsx' : './pages/spa/index.page.client.jsx'
        editFile(file, (s) => s.replace('<h1>SPA</h1>', '<h1>SPA !</h1>'))
        await autoRetry(async () => {
          expect(await page.textContent('h1')).toBe('SPA !')
        })
        await sleep(HMR_SLEEP)
        editFileRevert()
        await autoRetry(async () => {
          expect(await page.textContent('h1')).toBe('SPA')
        })
      }
      // Ensure JavaScript was HMR'd
      expect(await page.textContent('button')).toContain('Counter 1')
      {
        await testColor('green')
        await sleep(HMR_SLEEP)
        editFile('./pages/spa/index.css', (s) => s.replace('color: green', 'color: gray'))
        await testColor('gray')
        await sleep(HMR_SLEEP)
        editFileRevert()
        await testColor('green')
      }
      // Ensure CSS was HMR'd
      expect(await page.textContent('button')).toContain('Counter 1')
    }
  })

  test('HTML + JS', async () => {
    {
      const html = await fetchHtml('/html-js')
      expect(html).toContain('This page is rendered to HTML and has only few lines of browser-side JavaScript.')
      if (isPreview) {
        const jsImport = isV1Design
          ? partRegex`<script type="module" src="/assets/entries/pages_html-js_client.${hash}.js" defer></script>`
          : partRegex`<script type="module" src="/assets/entries/pages_html-js_default.page.client.${hash}.js" defer>`
        expect(html).toMatch(jsImport)
      } else {
        const jsImport = isV1Design
          ? partRegex`import("/@fs/${path}/pages/html-js/+client.js");`
          : partRegex`import("/@fs/${path}/pages/html-js/_default.page.client.js");`
        expect(html).toMatch(jsImport)
      }
    }

    await page.goto(getServerUrl() + '/html-js')
    await clickCounter()
  })
  if (!isPreview) {
    test('HTML + JS - HMR', async () => {
      // Page has finished loading and is interactive
      expect(await page.textContent('button')).toContain('Counter 1')
      // JS auto-reload
      {
        expect(await page.textContent('h1')).toBe('HTML + JS')
        {
          // No HMR for HTML + JS
          const navPromise = page.waitForNavigation()
          const file = isV1Design ? './pages/html-js/+Page.jsx' : './pages/html-js/index.page.server.jsx'
          editFile(file, (s) => s.replace('<h1>HTML + JS</h1>', '<h1>HTML + JS !</h1>'))
          await navPromise
          // But auto-reload works
          expect(await page.textContent('h1')).toBe('HTML + JS !')
        }
        {
          const navPromise = page.waitForNavigation()
          editFileRevert()
          await navPromise
          expect(await page.textContent('h1')).toBe('HTML + JS')
        }
      }
      // CSS HMR
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

    await page.goto(getServerUrl() + '/ssr')
    await clickCounter()
    expect(await page.textContent('button')).toContain('Counter 1')

    if (!isPreview) {
      expect(await page.textContent('button')).toContain('Counter 1')
      {
        expect(await page.textContent('h1')).toBe('SSR')
        await sleep(HMR_SLEEP)
        const file = isV1Design ? './pages/ssr/+Page.jsx' : './pages/ssr/index.page.jsx'
        editFile(file, (s) => s.replace('<h1>SSR</h1>', '<h1>SSR !</h1>'))
        await autoRetry(async () => {
          expect(await page.textContent('h1')).toBe('SSR !')
        })
        await sleep(HMR_SLEEP)
        editFileRevert()
        await autoRetry(async () => {
          expect(await page.textContent('h1')).toBe('SSR')
        })
      }
      // Ensure HMR instead of page reload
      expect(await page.textContent('button')).toContain('Counter 1')
      {
        await testColor('blue')
        await sleep(HMR_SLEEP)
        editFile('./pages/ssr/index.css', (s) => s.replace('color: blue', 'color: gray'))
        await testColor('gray')
        await sleep(HMR_SLEEP)
        editFileRevert()
        await testColor('blue')
      }
      // Ensure HMR instead of page reload
      expect(await page.textContent('button')).toContain('Counter 1')
    }
  })

  test("CSS of other pages isn't loaded", async () => {
    {
      const html = await fetchHtml('/')
      expect(html.split('text/css').length).toBe(2)
      if (!isPreview) {
        expect(html).toContain('<link rel="stylesheet" type="text/css" href="/renderer/PageLayout.css')
      }
    }
    for (const page of ['html-only', 'html-js', 'spa', 'ssr']) {
      const html = await fetchHtml(`/${page}`)
      expect(html.split('text/css').length).toBe(3)
      if (!isPreview) {
        expect(html).toContain('<link rel="stylesheet" type="text/css" href="/renderer/PageLayout.css')
        expect(html).toContain(`<link rel="stylesheet" type="text/css" href="/pages/${page}/index.css`)
      }
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
    await page.waitForFunction(() => window.document.body.textContent!.includes('Counter')) // Wait until page has loaded
    expect(await page.textContent('button')).toContain('Counter 0')
    await autoRetry(async () => {
      await page.click('button')
      expect(await page.textContent('button')).toContain('Counter 1')
    })
  }
  function testClientRouting(html: string) {
    if (isPreview) {
      expect(html).toMatch(
        partRegex`<script type="module" src="/assets/entries/entry-client-routing.${hash}.js" defer>`
      )
    } else {
      expect(html).toMatch(partRegex`import("/@fs/${path}/vite-plugin-ssr/${path}/client-routing-runtime/${path}");`)
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
