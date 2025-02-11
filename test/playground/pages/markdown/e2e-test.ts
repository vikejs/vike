export { testRouteStringDefinedInConfigFile }
export { testMarkdown }
export { testMarkdownSideExports }

import { autoRetry, expect, expectLog, fetchHtml, getServerUrl, page, test } from '@brillout/test-e2e'
import { testCounter } from '../../../utils'

function testRouteStringDefinedInConfigFile() {
  test('Route String defined in +config.js', async () => {
    // Route String '/markdown' defined in `+config.js > export default { route }` instead of +route.js
    const html = await fetchHtml('/markdown')
    expect(html).toContain('This page is written in <em>Markdown</em>')
  })
}

function testMarkdown(isDev: boolean) {
  test('markdown page HTML', async () => {
    const html = await fetchHtml('/markdown')
    expect(html).toContain('<h1>Side export .md file</h1>')

    // See also expectLog() test below
    if (isDev) expect(html).toContain('/pages/markdown/+client.ts')
  })

  test('markdown page DOM', async () => {
    await page.goto(getServerUrl() + '/markdown')
    expect(await page.textContent('body')).toContain('This page is written in Markdown')

    await testCounter()

    await autoRetry(() => {
      expectLog('Hello from +client.ts with viewport height', {
        filter: (logEntry) => logEntry.logSource === 'Browser Log'
      })
    })
  })
}

function testMarkdownSideExports() {
  test('Side export - HTML', async () => {
    const html = await fetchHtml('/markdown')
    // 'Some title' is defined by `export { frontmatter }` of /pages/markdown/+Page.md
    expect(html).toContain('<title>Some title set in mdx</title>')
  })
}
