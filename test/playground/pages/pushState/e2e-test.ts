export { testHistoryPushState }

import { test, page, getServerUrl, expect, sleep, autoRetry } from '@brillout/test-e2e'
import { testCounter, expectUrl } from '../../../utils'

function testHistoryPushState() {
  test('history.pushState()', async () => {
    // Timestamp component works as expected
    await page.goto(getServerUrl() + '/')
    await testCounter()
    await page.click('a[href="/pushState"]')
    const timestamp1 = await getTimestamp()
    await page.click('a[href="/markdown"]')
    await page.click('a[href="/pushState"]')
    const timestamp2 = await getTimestamp()
    expect(timestamp2 > timestamp1).toBe(true)

    // Calling history.pushState() doesn't trigger a re-render, thus timestamp doesn't change
    await expectUrl('/pushState')
    {
      const btn = page.locator('button', { hasText: 'Change URL' })
      await btn.click()
    }
    await expectUrl('/pushState?query')
    const timestamp3 = await getTimestamp()
    expect(timestamp3).toBe(timestamp2)

    // Navigating back doesn't trigger a re-render, thus timestamp doesn't change
    await page.goBack()
    await expectUrl('/pushState')
    const timestamp4 = await getTimestamp()
    expect(timestamp4).toBe(timestamp2)
    await page.goForward()
    await expectUrl('/pushState?query')
    const timestamp5 = await getTimestamp()
    expect(timestamp5).toBe(timestamp2)

    // Navigating outside the page does trigger a re-render
    await page.goBack()
    await page.goBack()
    await expectUrl('/markdown')
    await page.goForward()
    await expectUrl('/pushState')
    await sleep(100)
    const timestamp6 = await getTimestamp()
    expect(timestamp6 > timestamp2).toBe(true)
    await page.goForward()
    await expectUrl('/pushState?query')
    const timestamp7 = await getTimestamp()
    expect(timestamp7).toBe(timestamp6)
  })

  return

  async function getTimestamp() {
    let timestampStr: string
    await autoRetry(async () => {
      const val = await page.evaluate(() => document.querySelector('#timestamp')?.textContent)
      expect(val).toBeTruthy()
      timestampStr = val!
    })
    const timestamp = parseInt(timestampStr!, 10)

    // Is a valid timestamp
    expect(timestamp > new Date('2024-01-01').getTime()).toBe(true)
    expect(timestamp < new Date('2050-01-01').getTime()).toBe(true)

    // Ensure subsequent generated timestamps aren't equal
    await sleep(10)

    return timestamp
  }
}
