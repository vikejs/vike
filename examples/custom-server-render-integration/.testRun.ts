import { autoRetry, fetchHtml, page, run, urlBase } from '../../libframe/test/setup'

export { testRun }

function testRun(npmScript: 'npm run dev' | 'npm run prod') {
  run(npmScript)

  test('page is rendered to HTML & interactive', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('I am rendered to HTML and interactive')

    page.goto(`${urlBase}/`)
    expect(await page.textContent('body')).toContain('Count: 0')
    // `autoRetry` because browser-side code may not be loaded yet
    await autoRetry(async () => {
      await page.click('button')
      expect(await page.textContent('body')).toContain('Count: 1')
    })
  })
}
