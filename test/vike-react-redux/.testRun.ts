export { testRun }

import { test, expect, run, page, getServerUrl, autoRetry, fetchHtml, isWindows, isCI } from '@brillout/test-e2e'

function testRun(cmd: `pnpm run ${'dev' | 'preview' | 'preview:ssg'}`) {
  run(cmd)

  test('count', async () => {
    await page.goto(getServerUrl() + '/')
    await testCounter()
    await clientSideNavigation()
    await fullPageReload()
  })
  async function clientSideNavigation() {
    await page.click('a:has-text("About")')
    await page.waitForFunction(() => (window as any)._vike.fullyRenderedUrl === '/about')
    await testCounter(1)
    await page.click('a:has-text("Welcome")')
    await page.waitForFunction(() => (window as any)._vike.fullyRenderedUrl === '/')
    await testCounter(2)
  }
  async function fullPageReload() {
    await page.goto(getServerUrl() + '/about')
    await testCounter()
    await page.goto(getServerUrl() + '/')
    await testCounter()
  }

  test('todos - initial list', async () => {
    await page.goto(getServerUrl() + '/')
    await expectInitialList()
  })
  async function expectInitialList() {
    const buyApples = 'Buy apples'
    const nodeVerison = `Node.js ${process.version}`
    {
      const html = await fetchHtml('/')
      expect(html).toContain(`<li>${buyApples}</li>`)
      expect(html).toContain(nodeVerison)
    }
    {
      const bodyText = await page.textContent('body')
      expect(bodyText).toContain(buyApples)
      expect(bodyText).toContain(nodeVerison)
      expect(await getNumberOfItems()).toBe(2)
    }
  }

  test('todos - add to-do', async () => {
    // No clue why this started to fail only in GitHub CI Linux at https://github.com/vikejs/vike-react/pull/177 (it doesn't fail locally nor on windows) — let's skip for now and try again later.
    // TODO/soon: remove this
    if (isCI() && !isWindows()) return

    await page.fill('input[type="text"]', 'Buy bananas')
    await page.click('button[type="submit"]')
    const expectBananas = async () => {
      await autoRetry(async () => {
        expect(await getNumberOfItems()).toBe(3)
      })
      expect(await page.textContent('body')).toContain('Buy bananas')
    }
    await expectBananas()

    await testCounter()
    await clientSideNavigation()
    await expectBananas()

    // Full page reload
    await fullPageReload()
    await expectInitialList()
  })
}

async function getNumberOfItems() {
  return await page.evaluate(() => document.querySelectorAll('#todo-list li').length)
}

async function testCounter(inc: 0 | 1 | 2 = 0) {
  const counterInitValue = 42
  const currentValue = counterInitValue + inc
  // autoRetry() in case page just got client-side navigated
  await autoRetry(
    async () => {
      const btn = page.locator('button', { hasText: 'Counter' })
      expect(await btn.textContent()).toBe(`Counter ${currentValue}`)
    },
    { timeout: 5 * 1000 },
  )
  // autoRetry() in case page isn't hydrated yet
  await autoRetry(
    async () => {
      const btn = page.locator('button', { hasText: 'Counter' })
      await btn.click()
      expect(await btn.textContent()).toBe(`Counter ${currentValue + 1}`)
    },
    { timeout: 5 * 1000 },
  )
}
