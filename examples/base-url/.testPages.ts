import { page, run, autoRetry, fetchHtml, urlBase } from '../../libframe/test/setup'

export { testPages }

function testPages(cmd: 'npm run dev' | 'npm run prod:static' | 'npm run prod:server', isDev: boolean = false) {
  const baseUrl = isDev ? '' : '/dist/client'
  const addBaseUrl = (url: string) => baseUrl + url

  run(cmd, { baseUrl })

  test('page content is rendered to HTML', async () => {
    const html = await fetchHtml(addBaseUrl('/'))

    expect(html).toContain('<h1>Welcome</h1>')
    expect(html).toContain(`<a href="${addBaseUrl('/')}">Home</a>`)
    expect(html).toContain(`<a href="${addBaseUrl('/about')}">About</a>`)
  })

  test('page is rendered to the DOM and interactive', async () => {
    expect(await page.textContent('h1')).toBe('Welcome')
    expect(await page.textContent('button')).toBe('Counter 0')
    await autoRetry(async () => {
      await page.click('button')
      expect(await page.textContent('button')).toContain('Counter 1')
    })
  })

  test('Client Routing', async () => {
    await page.click(`a[href="${addBaseUrl('/about')}"]`)
    await autoRetry(async () => {
      expect(await page.textContent('h1')).toBe('About')
    })

    // Page was Client-side Routed; we check whether the HTML is from the first page before Client-side Routing
    const html = await page.content()
    // `page.content()` doesn't return the original HTML (it dumps the DOM to HTML).
    // Therefore only the serialized `pageContext` tell us the original HTML.
    expect(html.split('_pageId').length).toBe(2)
    expect(html).toContain('"_pageId":"/pages/index"')
  })
}
