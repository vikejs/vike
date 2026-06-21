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

  // TEST: page defined programmatically with a Route Function (config.pages, pointer import — see route.ts)
  test('programmatically defined page with Route Function (config.pages) HTML', async () => {
    const html = await fetchHtml('/programmatic-route-function/hello')
    expect(html).toContain('<h1>Programmatic Page</h1>')
    // TEST: the Route Function ran at runtime and its routeParams reached the page
    expect(html).toContain('routeParamName: hello')
    // TEST: the page inherits the global /pages/+config.ts (title + vike-react renderer)
    expect(html).toContain('<title>Big Playground</title>')
  })
  test('programmatically defined page with Route Function (config.pages) DOM', async () => {
    await page.goto(getServerUrl() + '/programmatic-route-function/world')
    expect(await page.textContent('body')).toContain('routeParamName: world')
    await testCounter()
  })
}
