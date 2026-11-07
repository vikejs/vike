export { testGuardClientOnly }

import { autoRetry, expect, expectLog, fetchHtml, getServerUrl, page, test } from '@brillout/test-e2e'
import { ensureWasClientSideRouted, expectUrl, testCounter } from '../../../utils'

function testGuardClientOnly() {
  test('+guard.client.ts throws `null`', async () => {
    await page.goto(getServerUrl() + '/guard-client-only?throw-null')
    await autoRetry(() => {
      expectLog('The thrown value is `null`', { filter: (log) => log.logSource === 'Browser Error' })
    })
    expectLog('No error page defined.', { filter: (log) => log.logSource === 'Browser Error' })
  })

  test('+guard.client.ts', async () => {
    const html = await fetchHtml('/guard-client-only')
    expect(html).toContain('I am only rendered on the server-side')

    // Test: first-page visit
    await page.goto(getServerUrl() + '/guard-client-only')
    await testCounter()
    await expectUrl('/star-wars')
    await ensureWasClientSideRouted('/pages/guard-client-only')

    // Test: client-side navigation visit
    await page.goto(getServerUrl() + '/markdown')
    await testCounter()
    await page.click('a[href="/guard-client-only"]')
    await testCounter()
    await expectUrl('/star-wars')
    await ensureWasClientSideRouted('/pages/markdown')
  })
}
