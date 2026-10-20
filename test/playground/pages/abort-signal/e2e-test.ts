export { testAbortSignal }

import { autoRetry, expect, getServerUrl, page, test } from '@brillout/test-e2e'
import { expectUrl, testCounter } from '../../../utils'

function testAbortSignal() {
  test('pageContext.abortSignal', async () => {
    await page.goto(getServerUrl() + '/')
    await testCounter()
    await page.click('a[href="/abort-signal"]')
    // Its onRenderClient() hook is running
    await expectUrl('/abort-signal')
    await page.click('a[href="/about"]')
    await autoRetry(async () => expect(await page.textContent('h1')).toBe('About'), { timeout: 3 * 1000 })
  })
}
