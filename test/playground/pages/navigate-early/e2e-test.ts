export { testNavigateEarly }

import { autoRetry, getServerUrl, page, test } from '@brillout/test-e2e'
import { expectUrl } from '../../../utils'

function testNavigateEarly() {
  test('Calling navigate() early in +client.js', async () => {
    await page.goto(getServerUrl() + '/navigate-early')
    await autoRetry(
      () => {
        expectUrl('/markdown')
      },
      { timeout: 5000 }
    )
  })
}
