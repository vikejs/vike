export { testOtherFrameworkNavigation }

import { test, page, getServerUrl, expect, sleep } from '@brillout/test-e2e'
import { expectUrl, waitForNavigation } from '../../utils'

function testOtherFrameworkNavigation() {
  test('navigate from another SPA framework', async () => {
    await page.goto(getServerUrl() + '/other-framework.html')

    let navPromise = await waitForNavigation()
    await page.click('a[href="/star-wars"]')
    await navPromise()

    await expectUrl('/star-wars')
    expect(await page.textContent('body')).toContain('Star Wars Movies')
    await sleep(1000)

    navPromise = await waitForNavigation()
    await page.goBack()
    // Page should reload because we are exiting Vike land
    await navPromise()

    await expectUrl('/other-framework.html')
    expect(await page.textContent('body')).toContain('Other Framework Page')
  })
}
