export { testRun }

import { page, run, autoRetry, fetchHtml, getServerUrl, test, expect } from '@brillout/test-e2e'

function testRun(cmd: 'npm run dev' | 'npm run preview') {
  run(cmd)

  test('page content is rendered to HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<div id="root"></div>')
  })

  test('page is rendered to the DOM and interactive', async () => {
    await page.goto(getServerUrl() + '/')
    // `autoRetry` because browser-side code may not be loaded yet
    await autoRetry(async () => {
      expect(await page.textContent('button')).toBe('Counter 0')
    })
    await page.click('button')
    expect(await page.textContent('button')).toBe('Counter 1')
  })
}
