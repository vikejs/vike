export { testSideExports }
export { testRouteStringDefinedInConfigFile }

import { test, fetchHtml, expect, getServerUrl, page } from '@brillout/test-e2e'
import { testCounter } from '../../../utils'

function testRouteStringDefinedInConfigFile() {
  test('Route String defined in +config.js', async () => {
    // Route String '/markdown' defined in `+config.js > export default { route }` instead of +route.js
    const html = await fetchHtml('/markdown')
    expect(html).toContain('<h1>Side export .md file</h1>')
  })
}

function testSideExports() {
  test('Side export - HTML', async () => {
    const html = await fetchHtml('/markdown')
    // 'Some title' is defined by `export { frontmatter }` of /pages/markdown-page/+Page.md
    expect(html).toContain('<title>Some title set in mdx</title>')
  })

  test('Side export - DOM', async () => {
    await page.goto(getServerUrl() + '/markdown')
    await testCounter()
  })
}
