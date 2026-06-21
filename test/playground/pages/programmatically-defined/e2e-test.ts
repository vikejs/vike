export { testProgrammaticPage }

import { expect, fetchHtml, getServerUrl, page, test } from '@brillout/test-e2e'
import { testCounter } from '../../../utils'

// TEST: page defined programmatically via `config.pages` (see /pages/+config.ts)
function testProgrammaticPage() {
  test('programmatically defined page (config.pages) HTML', async () => {
    const html = await fetchHtml('/programmatic')
    expect(html).toContain('<h1>Programmatic Page</h1>')
    expect(html).toContain('This page is defined programmatically.')
    // TEST: the programmatic page inherits the global /pages/+config.ts (title + vike-react renderer)
    expect(html).toContain('<title>Big Playground</title>')
  })
  test('programmatically defined page (config.pages) DOM', async () => {
    await page.goto(getServerUrl() + '/programmatic')
    expect(await page.textContent('body')).toContain('This page is defined programmatically')
    await testCounter()
  })
}
