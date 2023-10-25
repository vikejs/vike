export { testRun }

import {
  page,
  test,
  expect,
  run,
  fetchHtml,
  partRegex,
  getServerUrl,
  testScreenshotFixture,
  isCI,
  skip
} from '@brillout/test-e2e'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview') {
  {
    // Preview => `npm run preview` takes a long time
    // Dev => `Learn more collapsible` takes a long time
    const additionalTimeout = 120 * 1000
    run(cmd, { additionalTimeout, doNotFailOnWarning: true })
  }

  test('page content is rendered to HTML', async () => {
    {
      const html = await fetchHtml('/')
      expect(html).toContain(
        '<meta name="description" content="Like Next.js/Nuxt but as do-one-thing-do-it-well Vite plugin." />'
      )
      expect(html).toContain('integrate tools manually')
      expect(html).toMatch(partRegex`<h2>${/[^\/]+/}Control</h2>`)
      expect(html).toContain('<h2>🔧<!-- --> Control</h2>')
    }
    {
      const html = await fetchHtml('/stream')
      expect(html).toContain('<title>HTML Streaming | Vike</title>')
      expect(html).toContain('<h2 id="initial-data-after-stream-end">Initial data after stream end</h2>')
      expect(html).not.toContain('<meta name="description"')
    }
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
    if (!isCI()) {
      // skip() has no effect here (the skip() function is used to avoid an error when omitting the run() function)
      //  - @brillout/test-e2e should eventually make it useful here as well
      skip('The screenshot fixture of the docs website only matches the CI environment')
      return
    }
    await page.locator('#version-number').evaluate((element) => (element.innerHTML = 'v9.9.99'))
    await testScreenshotFixture({ doNotTestLocally: true })
  })
}
