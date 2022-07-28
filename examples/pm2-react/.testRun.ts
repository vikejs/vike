import { page, run, partRegex, autoRetry, fetchHtml, urlBase } from '../../libframe/test/setup'

export { testRun }

function testRun(cmd: 'npm run dev' | 'npm run preview') {
  run(cmd)

  test('page content is rendered to HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<h1>Welcome</h1>')
    // Vue injects: `!--[-->Home<!--]-->`
    expect(html).toMatch(partRegex`<a ${/[^\>]+/}>${/.*/}Home${/.*/}</a>`)
    expect(html).toMatch(partRegex`<a ${/[^\>]+/}>${/.*/}About${/.*/}</a>`)
  })

  test('page is rendered to the DOM and interactive', async () => {
    await page.goto(urlBase + '/')
    await page.click('a[href="/"]')
    expect(await page.textContent('h1')).toBe('Welcome')
    expect(await page.textContent('button')).toBe('Counter 0')
    // `autoRetry` because browser-side code may not be loaded yet
    await autoRetry(async () => {
      await page.click('button')
      expect(await page.textContent('button')).toBe('Counter 1')
    })
  })

  test('about page', async () => {
    await page.click('a[href="/about"]')
    expect(await page.textContent('h1')).toBe('About')
    // CSS is loaded only after being dynamically `import()`'d from JS
    await autoRetry(async () => {
      expect(await page.$eval('h1', (e) => getComputedStyle(e).color)).toBe('rgb(0, 128, 0)')
    })
  })
}
