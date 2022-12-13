export { testRun }

import { page, test, expect, run, fetchHtml, partRegex, getServerUrl, testScreenshotFixture } from '@brillout/test-e2e'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview') {
  {
    // Preview => `npm run preview` takes a long time
    // Dev => `Learn more collapsible` takes a long time
    const additionalTimeout = 120 * 1000
    run(cmd, { additionalTimeout })
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
      expect(html).toContain('<title>HTML Streaming | vite-plugin-ssr</title>')
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
    await testScreenshotFixture()
  })
}
