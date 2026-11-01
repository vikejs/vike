export { testRun }

import { page, test, expect, run, autoRetry, getServerUrl } from '@brillout/test-e2e'
import { ensureWasClientSideRouted, expectUrl } from '../../test/utils'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview') {
  run(cmd)

  // Regression test: a navigation started while hydration is still in progress (hydrationCanBeAborted isn't enabled)
  // must wait for the hydration to finish, and then complete.
  test('navigation during hydration completes', async () => {
    await page.goto(getServerUrl() + '/', { waitUntil: 'domcontentloaded' })
    // Hydration is in progress: onRenderClient() was called but isn't done yet
    await page.waitForFunction(() => (window as any).__hydrationStarted === true)
    await page.click('a[href="/about"]')
    await autoRetry(
      async () => {
        expect(await page.textContent('h1')).toBe('About')
      },
      { timeout: 10 * 1000 },
    )
    await expectUrl('/about')
    await ensureWasClientSideRouted('/pages/index')
  })
}
