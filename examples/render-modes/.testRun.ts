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
} from '@brillout/test-e2e'
import assert from 'node:assert'
import { waitForNavigation, sleepBeforeEditFile } from '../../test/utils'

export { testRun }

// Doesn't work anymore with Vite 6.
// Vite 6 Breaking change: https://vite.dev/guide/migration.html#:~:text=%5B%2316471%5D%20feat%3A%20v6,can%20be%20used%3A
// Workaround doesn't seem to work: see https://github.com/vikejs/vike/pull/2069 commit `renable HMR test for HTML-only`
const disableTestHtmlOnlyHMR = true

// TO-DO/next-major-release: remove non-V1 design case
function testRun(cmd: 'npm run dev' | 'npm run prod' | 'npm run preview', isV1Design?: true) {
  run(cmd, {
    // HMR tests are flaky (I couldn't make them reliable)
    isFlaky: true,
  })

  const isProd = cmd !== 'npm run dev'

  const hash = /[a-zA-Z0-9_-]+/
  const path = /[^\>]+/

  test('HTML-only', async () => {
    const html = await fetchHtml('/html-only')
    expect(html).toContain('<h1>HTML-only</h1>')
    expect(html).toContain('This page has zero browser-side JavaScript.')
    if (isProd) {
      expect(html).not.toContain('<script')
      expect(html).not.toContain('as="rel="modulepreload""')
      expect(html).not.toContain('as="script"')
      expect(html).toMatch(
        partRegex`<link rel="stylesheet" type="text/css" href="/assets/static/pages_html-only_index-bda8e411.${hash}.css">`,
      )
      expect(html).toMatch(
        partRegex`<link rel="stylesheet" type="text/css" href="/assets/static/renderer_Layout-031b266d.${hash}.css">`,
      )
    } else {
      expect(html).toContain('<script')
      expect(html).toContain('@vite/client')
      expect(html).toContain('from "/@react-refresh"')
      expect(html).toContain('<link rel="stylesheet" type="text/css" href="/renderer/Layout.css?direct">')
      expect(html).toContain('<link rel="stylesheet" type="text/css" href="/pages/html-only/index.css?direct">')
    }
    await page.goto(getServerUrl() + '/html-only')
    await testColor('orange')
  })
  if (!isProd && !disableTestHtmlOnlyHMR) {
    test('HTML-only - HMR', async () => {
      {
        const url = getServerUrl() + '/html-only'
        {
          const viteClientConnected = page.waitForEvent('console', {
            predicate: (consoleMessage) => {
              const text = consoleMessage.text()
              return text === '[vite] connected.'
            },
          })
          await page.goto(url)
          expect(await page.textContent('h1')).toBe('HTML-only')
          await viteClientConnected
        }
        // No HMR for JavaScript
        {
          // We can't use `const navPromise = page.waitForURL(url)` for page reloads, see https://github.com/microsoft/playwright/issues/20853
          const navPromise = await waitForNavigation()
          const file = isV1Design ? './pages/html-only/+Page.jsx' : './pages/html-only/index.page.server.jsx'
          editFile(file, (s) => s.replace('<h1>HTML-only</h1>', '<h1>HTML-only !</h1>'))
          await navPromise()
          // But auto reload works
          expect(await page.textContent('h1')).toBe('HTML-only !')
        }
        {
          // We can't use `const navPromise = page.waitForURL(url)` for page reloads, see https://github.com/microsoft/playwright/issues/20853
          const navPromise = await waitForNavigation()
          editFileRevert()
          await navPromise()
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

  if (isV1Design) {
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
      if (!isProd) {
        {
          expect(await page.textContent('h1')).toBe('SPA')
          const file = isV1Design ? './pages/spa/+Page.jsx' : './pages/spa/index.page.client.jsx'
          await sleepBeforeEditFile()
          editFile(file, (s) => s.replace('<h1>SPA</h1>', '<h1>SPA !</h1>'))
          await autoRetry(async () => {
            expect(await page.textContent('h1')).toBe('SPA !')
          })
          await sleepBeforeEditFile()
          editFileRevert()
          await autoRetry(async () => {
            expect(await page.textContent('h1')).toBe('SPA')
          })
        }
        // Ensure JavaScript was HMR'd
        expect(await page.textContent('button')).toContain('Counter 1')
        {
          await testColor('green')
          await sleepBeforeEditFile()
          editFile('./pages/spa/index.css', (s) => s.replace('color: green', 'color: gray'))
          await testColor('gray')
          await sleepBeforeEditFile()
          editFileRevert()
          await testColor('green')
        }
        // Ensure CSS was HMR'd
        expect(await page.textContent('button')).toContain('Counter 1')
      }
    })
  }

  test('HTML + JS', async () => {
    {
      const html = await fetchHtml('/html-js')
      expect(html).toContain('This page is rendered to HTML and has only few lines of browser-side JavaScript.')
      if (isProd) {
        const jsImport = isV1Design
          ? partRegex`<script src="/assets/entries/pages_html-js_client.${hash}.js" type="module" async></script>`
          : partRegex`<script src="/assets/entries/pages_html-js_default.page.client.${hash}.js" type="module" async>`
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
  if (!isProd && !disableTestHtmlOnlyHMR) {
    test('HTML + JS - HMR', async () => {
      expect(await page.textContent('button')).toContain('Counter 1')
      // JS auto-reload
      {
        expect(await page.textContent('h1')).toBe('HTML + JS')
        // No HMR for HTML + JS
        {
          const navPromise = await waitForNavigation()
          const file = isV1Design ? './pages/html-js/+Page.jsx' : './pages/html-js/index.page.server.jsx'
          expect(await page.textContent('button')).toContain('Counter 1')
          editFile(file, (s) => s.replace('<h1>HTML + JS</h1>', '<h1>HTML + JS !</h1>'))
          await navPromise()
          // But auto-reload works
          expect(await page.textContent('h1')).toBe('HTML + JS !')
          // Page was reloaded
          expect(await page.textContent('button')).toContain('Counter 0')
          await clickCounter()
        }
        {
          const navPromise = await waitForNavigation()
          expect(await page.textContent('button')).toContain('Counter 1')
          editFileRevert()
          await navPromise()
          expect(await page.textContent('h1')).toBe('HTML + JS')
          // Page was reloaded
          expect(await page.textContent('button')).toContain('Counter 0')
        }
      }
      // HMR works for CSS
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

    if (!isProd) {
      expect(await page.textContent('button')).toContain('Counter 1')
      {
        expect(await page.textContent('h1')).toBe('SSR')
        const file = isV1Design ? './pages/ssr/+Page.jsx' : './pages/ssr/index.page.jsx'
        await sleepBeforeEditFile()
        editFile(file, (s) => s.replace('<h1>SSR</h1>', '<h1>SSR !</h1>'))
        await autoRetry(async () => {
          expect(await page.textContent('h1')).toBe('SSR !')
        })
        await sleepBeforeEditFile()
        editFileRevert()
        await autoRetry(async () => {
          expect(await page.textContent('h1')).toBe('SSR')
        })
      }
      // Ensure HMR instead of page reload
      expect(await page.textContent('button')).toContain('Counter 1')
      {
        await testColor('blue')
        await sleepBeforeEditFile()
        editFile('./pages/ssr/index.css', (s) => s.replace('color: blue', 'color: gray'))
        await testColor('gray')
        await sleepBeforeEditFile()
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
      expect(html.split('text/css').length).toBe(!isV1Design && isProd ? 4 : 2)
      if (!isProd) {
        expect(html).toContain('<link rel="stylesheet" type="text/css" href="/renderer/Layout.css')
      }
    }
    if (!isV1Design) return
    for (const page of ['html-only', 'html-js', 'spa', 'ssr']) {
      const html = await fetchHtml(`/${page}`)
      expect(html.split('text/css').length).toBe(3)
      if (!isProd) {
        expect(html).toContain('<link rel="stylesheet" type="text/css" href="/renderer/Layout.css')
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
    // Wait until page has loaded
    await page.waitForFunction(() => {
      const pageIsLoaded = window.document.body.textContent!.includes('Counter')
      return pageIsLoaded
    })
    expect(await page.textContent('button')).toContain('Counter 0')
    await autoRetry(async () => {
      await page.click('button')
      expect(await page.textContent('button')).toContain('Counter 1')
    })
  }
  function testClientRouting(html: string) {
    if (isProd) {
      expect(html).toMatch(
        partRegex`<script src="/assets/entries/entry-client-routing.${hash}.js" type="module" async>`,
      )
    } else {
      expect(html).toMatch(partRegex`import("/@fs/${path}/vike/${path}/runtime-client-routing/${path}");`)
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
