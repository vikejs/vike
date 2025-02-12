export { testNestedLayout }

import { test, page, getServerUrl, expect, autoRetry } from '@brillout/test-e2e'
import { testCounter } from '../../../utils'

function testNestedLayout() {
  test('Nested layout', async () => {
    await page.goto(getServerUrl() + '/nested-layout/42')
    expect(await page.textContent('h1')).toBe('Nested Layout')
    await testCounter()
    await expectIsScrollUp()
    await scrollDown()
    await expectIsScrollDown()
    await testCounter(1)
    await page.click('a[href="/nested-layout/42/reviews"]')
    await expectIsScrollDown()
    await page.click('a[href="/nested-layout/1337/reviews"]')
    await expectIsScrollUp()
    await scrollDown()
    await expectIsScrollDown()
    await page.click('a[href="/nested-layout/1337"]')
    await expectIsScrollDown()
    await testCounter(2)
    await expectIsScrollDown()
  })

  return

  async function scrollDown() {
    await page.evaluate(() => {
      window.document.documentElement.scrollTop = 51
    })
  }
  async function expectIsScrollUp() {
    await expectScroll(0)
  }
  async function expectIsScrollDown() {
    await expectScroll(51)
  }
  async function expectScroll(scroll: number) {
    await autoRetry(
      async () => {
        expect(await getScrollTop()).toBe(scroll)
      },
      { timeout: 5000 }
    )
  }
  async function getScrollTop() {
    const scrollTop = await page.evaluate(() => window.document.documentElement.scrollTop)
    return scrollTop
  }
}
