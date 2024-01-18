export { testRun }

import { page, test, expect, run, fetchHtml, getServerUrl, testScreenshotFixture } from '@brillout/test-e2e'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview') {
  {
    // Preview => `npm run preview` takes a long time
    // Dev => `Learn more collapsible` takes a long time
    const additionalTimeout = 120 * 1000
    run(cmd, { additionalTimeout, doNotFailOnWarning: true })
  }

  test('page content is rendered to HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('integrate tools manually')
  })

  test('Learn more collapsible', async () => {
    const collapsibleText = 'you control how your pages are rendered'
    const sectionHeading = 'Control'
    await page.goto(getServerUrl() + '/')
    await page.waitForFunction(() => (window as any).__docpress_hydrationFinished)
    const selector = `p:has-text("${collapsibleText}")`
    const locator = page.locator(selector)
    expect(await locator.count()).toBe(1)
    expect(await locator.isHidden()).toBe(true)
    await page.locator(`h2:has-text("${sectionHeading}")`).click()
    await page.waitForSelector(selector, { state: 'visible' })
    expect(await locator.isHidden()).toBe(false)
    await page.locator(`h2:has-text("${sectionHeading}")`).click()
    await page.waitForSelector(selector, { state: 'hidden' })
    expect(await locator.isHidden()).toBe(true)
    await page.locator(`h2:has-text("${sectionHeading}")`).click()
    await page.waitForSelector(selector, { state: 'visible' })
    expect(await locator.isHidden()).toBe(false)
  })

  test('screenshot fixture', async () => {
    await page.locator('#version-number').evaluate((element) => (element.innerHTML = 'v9.9.99'))
    await testScreenshotFixture({ doNotTestLocally: true })
  })
}
