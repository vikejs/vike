import { autoRetry, page, run, urlBase } from '../../libframe/test/setup'

export { testRun }

function testRun(npmScript: 'npm run dev' | 'npm run prod' | 'npm run prod:static') {
  run(npmScript)

  test(`Counter works`, async () => {
    page.goto(`${urlBase}/`)
    expect(await page.textContent('body')).toContain('Counter 0')
    // `autoRetry` because browser-side code may not be loaded yet
    await autoRetry(async () => {
      await page.click('button')
      expect(await page.textContent('body')).toContain('Counter 1')
    })
  })

  test("CSS doesn't leak", async () => {
    expect(await page.$eval('p', (e) => getComputedStyle(e).color)).toBe(`rgb(0, 0, 0)`)
  })

  test('PageLayout.css loaded', async () => {
    expect(await page.$eval('a', (e) => getComputedStyle(e).color)).toBe(`rgb(0, 0, 255)`)
  })

  test(`About page`, async () => {
    await page.click('a[href="/about"]')
    expect(await page.textContent('body')).toContain('This liltle app uses path aliases.')
  })

  // This tests the `vite-plugin-ssr:extractStyles` plugin.
  // (Retrieving the CSS from aliased import paths is not trivial.)
  test('CSS loaded also for HTML-only pages', async () => {
    page.goto(`${urlBase}/about`)
    await autoRetry(async () => {
      expect(await page.$eval('a', (e) => getComputedStyle(e).color)).toBe(`rgb(0, 0, 255)`)
    })
    expect(await page.$eval('p', (e) => getComputedStyle(e).color)).toBe(`rgb(255, 0, 255)`)
  })
}
