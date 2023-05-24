import { run, page, test, expect, getServerUrl, fetchHtml, autoRetry } from '@brillout/test-e2e'

export { testRun }

function testRun(cmd: 'npm run dev' | 'npm run preview') {
  run(cmd, { doNotFailOnWarning: true })

  test('page content is rendered to HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<li>Rendered to HTML.</li>')
  })

  test('page is rendered to the DOM and interactive', async () => {
    await page.goto(getServerUrl() + '/')
    // Interactive button
    expect(await page.textContent('button')).toBe('Counter 0')
    // `autoRetry` because browser-side code may not be loaded yet
    await autoRetry(async () => {
      await page.click('button')
      expect(await page.textContent('button')).toContain('Counter 1')
    })

    // Client-side routing
    await page.click('a[href="/star-wars"]')
    await autoRetry(async () => {
      expect(await page.textContent('h1')).toBe('Star Wars Movies')
    })
    expect(await page.textContent('body')).toContain('The Phantom Menace')

    // Page was Client-side Routed; we check whether the HTML is from the first page before Client-side Routing
    const html = await page.content()
    // `page.content()` doesn't return the original HTML (it dumps the DOM to HTML).
    // Therefore only the serialized `pageContext` tell us the original HTML.
    expect(html.split('_pageId').length).toBe(2)
    expect(html).toContain('"_pageId":"/pages/')
    expect(html).not.toContain('"_pageId":"/pages/star-wars')
    expect(html).toContain('"_pageId":"/pages/index')
  })

  test('data fetching page, HTML', async () => {
    const html = await fetchHtml('/star-wars')
    expect(html).toContain('<a href="/star-wars/6">Revenge of the Sith</a>')
    expect(html).toContain('<a href="/star-wars/4">The Phantom Menace</a>')
  })

  test('data fetching page, DOM', async () => {
    await page.goto(getServerUrl() + '/star-wars')
    const text = await page.textContent('body')
    expect(text).toContain('Revenge of the Sith')
    expect(text).toContain('The Phantom Menace')

    await page.click('a[href="/star-wars/4"]')
    await autoRetry(async () => {
      expect(await page.textContent('h1')).toBe('The Phantom Menace')
    })
    const pageContent = 'The Phantom MenaceRelease Date: 1999-05-19Director: George LucasProducer: Rick McCallum'
    expect(await page.textContent('body')).toContain(pageContent)
  })
}
