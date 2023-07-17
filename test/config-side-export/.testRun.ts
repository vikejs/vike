export { testRun }

import { test, expect, run, fetchHtml, page, getServerUrl } from '@brillout/test-e2e'
import { testCounter } from '../utils'

function testRun(cmd: 'npm run dev' | 'npm run preview' | 'npm run prod') {
  run(cmd)

  test('page content is rendered to HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<p>Some text</p>')
    expect(html).toContain('<title>Some title</title>')
  })

  test('page is rendered to the DOM and interactive', async () => {
    await page.goto(getServerUrl() + '/')
    await testCounter()
  })
}
