import { autoRetry, fetchHtml, page, run, urlBase } from '../../libframe/test/setup'

export { runTest }

function runTest(npmScript: 'npm run dev' | 'npm run prod') {
  run(npmScript)

  test(`page is rendered to HTML [${npmScript}]`, async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('I am rendered to HTML and interactive')
  })

  test(`page is interactive [${npmScript}]`, async () => {
    page.goto(`${urlBase}/`)
    expect(await page.textContent('body')).toContain('Count: 0')
    // `autoRetry` because browser-side code may not be loaded yet
    await autoRetry(async () => {
      await page.click('button')
      expect(await page.textContent('body')).toContain('Count: 1')
    })
  })
}
