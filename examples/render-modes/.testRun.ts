import { run, page, urlBase, fetchHtml, autoRetry, partRegex } from '../../libframe/test/setup'

export { testRun }

function testRun(cmd: 'npm run dev' | 'npm run prod') {
  run(cmd)

  const isProd = cmd === 'npm run prod'

  const hash = /[a-z0-9]+/
  const path = /[^\>]+/

  test('HTML-only', async () => {
    const html = await fetchHtml('/html-only')
    expect(html).toContain('This page has zero browser-side JavaScript.')
    expect(html).toContain('As shown by the green text, CSS can be loaded')
    expect(html).toContain('<h1>')
    expect(html).not.toContain('@vite/client')
    if (isProd) {
      expect(html).not.toContain('<script')
      expect(html).toMatch(partRegex`<link rel="stylesheet" type="text/css" href="/assets/PageLayout.${hash}.css">`)
      expect(html).toMatch(
        partRegex`<link rel="stylesheet" type="text/css" href="/assets/index.page.server.${hash}.css">`,
      )
    } else {
      expect(html).toContain('import RefreshRuntime from "/@react-refresh"')
      expect(html).toContain('<link rel="stylesheet" type="text/css" href="/renderer/PageLayout.css?direct">')
      expect(html).toContain('<link rel="stylesheet" type="text/css" href="/pages/html-only/index.css?direct">')
    }
    await page.goto(urlBase + '/html-only')
    await testColor('green')
  })

  test('SPA', async () => {
    {
      const html = await fetchHtml('/spa')
      expect(html).not.toContain('h1')
      expect(html).toContain('<div id="react-container"></div>')
      testClientRouting(html)
    }

    await page.goto(urlBase + '/spa')
    await testColor('black')
    await testCounter()
  })

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
    await testColor('black')
    await testCounter()
  })

  test('SSR', async () => {
    {
      const html = await fetchHtml('/ssr')
      expect(html).toContain('Rendered to HTML and hydrated in the browser.')
      testClientRouting(html)
    }

    await page.goto(urlBase + '/ssr')
    await testColor('black')
    await testCounter()
  })

  return

  async function testColor(color: 'black' | 'green') {
    const greenAmount = (color === 'black' && '0') || (color === 'green' && '128')
    await autoRetry(async () => {
      const titleColor = await page.$eval('h1', (e) => getComputedStyle(e).color)
      expect(titleColor).toBe(`rgb(0, ${greenAmount}, 0)`)
    })
    expect(await page.$eval('p', (e) => getComputedStyle(e).color)).toBe(`rgb(0, ${greenAmount}, 0)`)
  }
  async function testCounter() {
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
