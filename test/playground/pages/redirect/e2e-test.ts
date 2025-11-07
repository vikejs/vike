export { testRedirect }

import { test, page, getServerUrl } from '@brillout/test-e2e'
import { expectUrl } from '../../../utils'

function testRedirect() {
  test('redirects to /about and works with back button', async () => {
    await page.goto(getServerUrl() + '/')
    await expectUrl('/')

    await page.click('a[href="/redirect"]')
    await expectUrl('/about')

    await page.goBack()
    await expectUrl('/')
  })

  return
}
