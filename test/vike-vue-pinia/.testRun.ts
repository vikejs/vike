export { testRun }

import { test, expect, run, fetchHtml, page, getServerUrl, autoRetry, sleep } from '@brillout/test-e2e'
const counter1 = 'button#counter-1'
const counter2 = 'button#counter-2'
const counter3 = 'button#counter-3'

function testRun(cmd: `pnpm run ${'dev' | 'preview' | 'preview:ssg'}`) {
  run(cmd)

  run('pnpm run dev')

  test('initial state', async () => {
    const url = '/'
    const html = await fetchHtml(url)
    expect(html).toContain('<button type="button" id="counter-1">Counter 1</button>')
    expect(html).toContain('<button type="button" id="counter-2">Counter 1</button>')
    await page.goto(getServerUrl() + url)
    expect(await page.textContent(counter1)).toBe('Counter 1')
    expect(await page.textContent(counter2)).toBe('Counter 1')
  })

  test('synced state', async () => {
    // autoRetry() for awaiting client-side code loading & executing
    await autoRetry(
      async () => {
        expect(await page.textContent(counter1)).toBe('Counter 1')
        await page.click(counter1)
        expect(await page.textContent(counter1)).toContain('Counter 2')
      },
      { timeout: 5 * 1000 },
    )
    expect(await page.textContent(counter1)).toBe('Counter 2')
    expect(await page.textContent(counter2)).toBe('Counter 2')
  })

  test('preserved state upon client-side navigation', async () => {
    await page.click('a[href="/about"]')
    expect(await page.textContent(counter3)).toBe('Counter 2')
    await page.click(counter3)
    expect(await page.textContent(counter3)).toContain('Counter 3')
    await page.click('a[href="/"]')
    expect(await page.textContent(counter1)).toBe('Counter 3')
    expect(await page.textContent(counter2)).toBe('Counter 3')
  })

  test('todos - initial list', async () => {
    await page.goto(getServerUrl() + '/')
    await expectInitialList()
  })
  async function expectInitialList() {
    const buyApples = 'Buy apples'
    const nodeVersion = `Node.js ${process.version}`
    {
      const html = await fetchHtml('/')
      expect(html).toContain(`<li>${buyApples}</li>`)
      expect(html).toContain(nodeVersion)
    }
    {
      const bodyText = await page.textContent('body')
      expect(bodyText).toContain(buyApples)
      expect(bodyText).toContain(nodeVersion)
      expect(await getNumberOfItems()).toBe(2)
    }
  }

  test('todos - add to-do', async () => {
    await sleep(300) // Seems to be required, otherwise the test is flaky. I don't know why.
    await page.fill('input[type="text"]', 'Buy bananas')
    await page.click('button[type="submit"]')
    await expectBananas()

    await testCounter(1)
    await clientSideNavigation()
    await expectBananas()

    // Full page reload
    await fullPageReload()
    await expectInitialList()
  })
  async function expectBananas() {
    await autoRetry(async () => {
      expect(await getNumberOfItems()).toBe(3)
    })
    expect(await page.textContent('body')).toContain('Buy bananas')
  }
  async function clientSideNavigation() {
    await page.click('a:has-text("About")')
    await page.waitForFunction(() => (window as any)._vike.fullyRenderedUrl === '/about')
    await testCounter(2)
    await page.click('a:has-text("Welcome")')
    await page.waitForFunction(() => (window as any)._vike.fullyRenderedUrl === '/')
    await testCounter(3)
  }
  async function fullPageReload() {
    await page.goto(getServerUrl() + '/about')
    await testCounter()
    await page.goto(getServerUrl() + '/')
    await testCounter(1)
  }
}

async function getNumberOfItems() {
  return await page.evaluate(() => document.querySelectorAll('#todo-list li').length)
}

async function testCounter(inc: 0 | 1 | 2 | 3 = 0) {
  const counterInitValue = 0
  const currentValue = counterInitValue + inc
  // autoRetry() in case page just got client-side navigated
  await autoRetry(
    async () => {
      const btn = page.locator('button', { hasText: 'Counter' }).first()
      expect(await btn.textContent()).toBe(`Counter ${currentValue}`)
    },
    { timeout: 5 * 1000 },
  )
  // autoRetry() in case page isn't hydrated yet
  await autoRetry(
    async () => {
      const btn = page.locator('button', { hasText: 'Counter' }).first()
      await btn.click()
      expect(await btn.textContent()).toBe(`Counter ${currentValue + 1}`)
    },
    { timeout: 5 * 1000 },
  )
}
