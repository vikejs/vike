import { autoRetry, page, test, expect, run, getServerUrl, fetchHtml } from '@brillout/test-e2e'

export { testRun }

function testRun(
  cmd: 'npm run dev' | 'npm run prod' | 'npm run prod:static',
  { isOldDesign }: { isOldDesign?: true } = {},
) {
  run(cmd)

  const isProd = cmd !== 'npm run dev'

  test(`Counter works`, async () => {
    page.goto(`${getServerUrl()}/`)
    expect(await page.textContent('body')).toContain('Counter 0')
    // `autoRetry` because browser-side code may not be loaded yet
    await autoRetry(async () => {
      await page.click('button')
      expect(await page.textContent('body')).toContain('Counter 1')
    })
  })

  if (!isOldDesign) {
    test("CSS doesn't leak", async () => {
      expect(await page.$eval('p', (e) => getComputedStyle(e).color)).toBe(`rgb(0, 0, 0)`)
    })
  }

  test('Layout.css loaded', async () => {
    expect(await page.$eval('a', (e) => getComputedStyle(e).color)).toBe(`rgb(0, 0, 255)`)
  })

  test(`About page`, async () => {
    await page.click('a[href="/about"]')
    expect(await page.textContent('body')).toContain('This app uses path aliases.')
  })

  test('About page is HTML-only', async () => {
    const script = '<script'
    {
      const html = await fetchHtml('/')
      expect(html).toContain(script)
    }
    {
      const html = await fetchHtml('/about')
      if (isProd) {
        // About page is an HTML-only page, i.e. `path-aliases/pages/about/+config.js > meta.Page.env` is `{ server: true }`.
        expect(html).not.toContain(script)
      }
    }
  })

  // This tests the `vike:extractAssets` plugin.
  // (Retrieving the CSS from aliased import paths isn't trivial.)
  test('CSS loaded also for HTML-only pages', async () => {
    page.goto(`${getServerUrl()}/about`)
    await autoRetry(async () => {
      expect(await page.$eval('a', (e) => getComputedStyle(e).color)).toBe(`rgb(0, 0, 255)`)
    })
    // color defined by styles/magenta-text.css
    expect(await page.$eval('p', (e) => getComputedStyle(e).color)).toBe(`rgb(255, 0, 255)`)
  })
}
