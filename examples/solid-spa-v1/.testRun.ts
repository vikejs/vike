export { testRun }

import { page, run, fetchHtml, getServerUrl, test, expect } from '@brillout/test-e2e'
import { testCounter } from '../../test/utils'

function testRun(cmd: 'npm run dev' | 'npm run preview') {
  run(cmd)

  test('page content is rendered to HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<div id="root"></div>')
  })

  test('page is rendered to the DOM and interactive', async () => {
    await page.goto(getServerUrl() + '/')
    await testCounter()
  })
}
