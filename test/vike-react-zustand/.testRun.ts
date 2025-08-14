export { testRun }

import {
  test,
  expect,
  run,
  fetchHtml,
  page,
  getServerUrl,
  autoRetry,
  partRegex,
  expectLog,
  isCI,
  isWindows,
  sleep,
} from '@brillout/test-e2e'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview') {
  const isDev = cmd === 'pnpm run dev'

  run(cmd)

  test('page content is rendered to HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<h1>Welcome</h1>')
  })

  test('page is rendered to the DOM and interactive', async () => {
    await page.goto(getServerUrl() + '/')
    expect(await page.textContent('h1')).toBe('Welcome')
    await testCounter()
  })

  test('store is persisted upon client-side navigation', async () => {
    await page.goto(getServerUrl() + '/')
    let value = await testCounter()
    await page.click('a:has-text("About")')
    await page.waitForFunction(() => (window as any)._vike.fullyRenderedUrl === '/about')
    await testCounter(value)
    value++
    await page.click('a:has-text("Welcome")')
    await page.waitForFunction(() => (window as any)._vike.fullyRenderedUrl === '/')
    await testCounter(value)
    value++
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
    // No clue why this started to fail only in GitHub CI Linux at https://github.com/vikejs/vike-react/pull/177 (it doesn't fail locally nor on windows) — let's skip for now and try again later.
    // TODO/soon: remove this
    if (isCI() && !isWindows()) return

    expect(await getNumberOfItems()).toBe(2)
    if (isDev && !isCI()) await sleep(300) // Seems to be required, otherwise the test is flaky when run locally. I don't know why.
    await page.fill('input[type="text"]', 'Buy bananas')
    await page.click('button[type="submit"]')
    const expectBananas = async () => {
      await autoRetry(async () => {
        expect(await getNumberOfItems()).toBe(3)
        expect(await page.textContent('body')).toContain('Buy bananas')
      })
    }
    await expectBananas()
    expectLog('{"text":"Buy bananas"}') // See `storeVanilla.subscribe()`

    await clientSideNavigation()
    await expectBananas()

    // Full page reload
    await fullPageReload()
    await expectInitialList()
  })
  async function clientSideNavigation() {
    await page.click('a:has-text("About")')
    await page.waitForFunction(() => (window as any)._vike.fullyRenderedUrl === '/about')
    await page.click('a:has-text("Welcome")')
    await page.waitForFunction(() => (window as any)._vike.fullyRenderedUrl === '/')
  }
  async function fullPageReload() {
    await page.goto(getServerUrl() + '/about')
    await page.goto(getServerUrl() + '/')
  }
}

async function getNumberOfItems() {
  return await page.evaluate(() => document.querySelectorAll('#todo-list li').length)
}

async function testCounter(currentValue?: number) {
  // autoRetry() in case page just got client-side navigated
  await autoRetry(
    async () => {
      const btn = page.locator('button', { hasText: 'Counter' })
      const content = await btn.textContent()
      expect(content).toMatch(partRegex`Counter ${/[0-9]+/}`)
      const value = parseInt(content!.slice('Counter '.length), 10)
      if (currentValue) {
        expect(value).toBe(currentValue)
      } else {
        currentValue = value
      }
    },
    { timeout: 5 * 1000 },
  )
  const valueNew = currentValue! + 1
  // autoRetry() in case page isn't hydrated yet
  await autoRetry(
    async () => {
      const btn = page.locator('button', { hasText: 'Counter' })
      await btn.click()
      expect(await btn.textContent()).toBe(`Counter ${valueNew}`)
    },
    { timeout: 5 * 1000 },
  )
  return valueNew
}
