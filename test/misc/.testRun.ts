export { testRun }

import { test, expect, fetchHtml, page, getServerUrl } from '@brillout/test-e2e'
import { testCounter } from '../utils'
import { testRun as testRunClassic } from '../../examples/react/.testRun'

function testRun(cmd: 'npm run dev' | 'npm run preview' | 'npm run prod') {
  testRunClassic(cmd, { skipScreenshotTest: true })

  test('Route String defined in +config.h.js', async () => {
    // Route String '/markdown' defined in `+config.h.js > export default { route }` instead of +route.js
    const html = await fetchHtml('/markdown')
    expect(html).toContain('<p>Some text</p>')
  })

  test('Side export - HTML', async () => {
    const html = await fetchHtml('/markdown')
    // 'Some title' is defined by `export { frontmatter }` of /pages/markdown-page/+Page.md
    expect(html).toContain('<title>Some title</title>')
  })

  test('Side export - DOM', async () => {
    await page.goto(getServerUrl() + '/markdown')
    await testCounter()
  })
}
