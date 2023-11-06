export { testRun }

import { test, expect, fetchHtml, page, getServerUrl } from '@brillout/test-e2e'
import { testCounter } from '../utils'
import { testRun as testRunClassic } from '../../examples/react/.testRun'

function testRun(cmd: 'npm run dev' | 'npm run preview' | 'npm run prod') {
  testRunClassic(cmd, { skipScreenshotTest: true })

  test('overriden filesystem route', async () => {
    // Route String '/markdown' defined in `+config.h.ts > export default { route }` instead of +route.js
    const html = await fetchHtml('/markdown')
    expect(html).toContain('<p>Some text</p>')
  })

  test('side export', async () => {
    const html = await fetchHtml('/markdown')
    expect(html).toContain('<title>Some title</title>')
  })

  test('hydration', async () => {
    await page.goto(getServerUrl() + '/markdown')
    await testCounter()
  })
}
