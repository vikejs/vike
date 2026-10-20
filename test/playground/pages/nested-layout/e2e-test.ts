export { testNestedLayout }
export { testPreviousPageContext }

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
    await nav('/nested-layout/42/reviews')
    await expectIsScrollDown()
    await testCounter(1)
    await nav('/nested-layout/1337/reviews')
    await expectIsScrollUp()
    await testCounter(2)
    await scrollDown()
    await expectIsScrollDown()
    await nav('/nested-layout/1337')
    await expectIsScrollDown()
    await testCounter(3)
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
      { timeout: 5000 },
    )
  }
  async function getScrollTop() {
    const scrollTop = await page.evaluate(() => window.document.documentElement.scrollTop)
    return scrollTop
  }
}

function testPreviousPageContext() {
  test('only the last three pageContexts are kept in memory', async () => {
    await page.goto(getServerUrl() + '/nested-layout/42')
    await testCounter()
    await nav('/nested-layout/42/reviews')
    await nav('/nested-layout/42/pricing')
    await nav('/nested-layout/42')
    await nav('/nested-layout/42/reviews')
    const previousPageContextsLength = await page.evaluate(() => {
      let length = 0
      let pageContext = window.pageContextLastRendered?.previousPageContext
      while (pageContext) {
        length++
        pageContext = pageContext.previousPageContext
      }
      return length
    })
    expect(previousPageContextsLength).toBe(2)
  })
}

async function nav(href: `/${string}`) {
  await page.click(`a[href="${href}"]`)
  await autoRetry(
    async () => {
      const fullyRenderedUrl = await page.evaluate(() => window._vike?.fullyRenderedUrl)
      expect(fullyRenderedUrl).toBe(href)
    },
    { timeout: 5000 },
  )
}
