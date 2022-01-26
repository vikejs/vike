import { page, run, autoRetry, fetchHtml, partRegex, urlBase } from '../../libframe/test/setup'

export { testRun }

function testRun(
  cmd: 'npm run dev' | 'npm run dev:base-url' | 'npm run prod:ssr' | 'npm run prod:ssg',
  { noBaseUrl }: { noBaseUrl?: true } = {},
) {
  const baseUrl = noBaseUrl ? '' : '/some/base-url'
  const addBaseUrl = (url: string) => baseUrl + url
  const isDev = cmd.startsWith('npm run dev')

  run(cmd)

  test('URLs are correctly contain Base URL in HTML', async () => {
    const html = await fetchHtml(addBaseUrl('/'))

    expect(html).toContain('<h1>Welcome</h1>')
    expect(html).toContain(`<a href="${addBaseUrl('/')}">Home</a>`)
    expect(html).toContain(`<a href="${addBaseUrl('/about')}">About</a>`)
    expect(html).toContain(`<link rel="manifest" href="${addBaseUrl('/manifest.json')}">`)
    if (isDev) {
      expect(html).toContain(`<link rel="icon" href="${addBaseUrl('/renderer/logo.svg')}" />`)
    } else {
      expect(html).toMatch(partRegex`<link rel="icon" href="${addBaseUrl('/assets/logo.')}${/[a-zA-Z0-9]+/}.svg" />`)
    }
  })

  test('page is rendered to the DOM and interactive', async () => {
    await page.goto(urlBase + baseUrl)
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
