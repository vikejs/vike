export { testRun }

import { test, expect, run, fetchHtml, page, getServerUrl, autoRetry } from '@brillout/test-e2e'

function testRun(cmd: 'npm run dev' | 'npm run preview' | 'npm run prod') {
  run(cmd)

  test('page content is rendered to HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<p>Some text</p>')
    expect(html).toContain('<title>Some title</title>')
  })

  test('page is rendered to the DOM and interactive', async () => {
    await page.goto(getServerUrl() + '/')
    expect(await page.textContent('button')).toBe('Counter 0')
    // `autoRetry` because client-side JavaScript may not be loaded yet
    await autoRetry(async () => {
      await page.click('button')
      expect(await page.textContent('button')).toBe('Counter 1')
    })
  })
}
