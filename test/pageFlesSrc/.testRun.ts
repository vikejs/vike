export { testRun }

import { page, test, expect, run, fetchHtml, partRegex, getServerUrl } from '@brillout/test-e2e'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview') {
  {
    // Preview => `npm run preview` takes a long time
    // Dev => `Learn more collapsible` takes a long time
    const additionalTimeout = 120 * 1000
    run(cmd, { additionalTimeout })
  }

  test('page content is rendered to HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<meta name="description" content="DocPress Demo" />')
    expect(html).toContain('Praesent eu augue lacinia, tincidunt purus nec, ultrices ante.')
    expect(html).toMatch(partRegex`<h2>${/[^\/]+/}Feature 2</h2>`)
  })

  test('Learn more collapsible', async () => {
    await page.goto(getServerUrl() + '/')
    await page.waitForFunction(() => (window as any).__docpress_hydrationFinished)
    const text = 'More content for Feature 2.'
    const selector = `p:has-text("${text}")`
    const locator = page.locator(selector)
    expect(await locator.count()).toBe(1)
    expect(await locator.isHidden()).toBe(true)
    await page.locator('h2:has-text("Feature 2")').click()
    await page.waitForSelector(selector, { state: 'visible' })
    expect(await locator.isHidden()).toBe(false)
    await page.locator('h2:has-text("Feature 2")').click()
    await page.waitForSelector(selector, { state: 'hidden' })
    expect(await locator.isHidden()).toBe(true)
  })

  test('Layout', async () => {
    const layout = await page.evaluate(() => {
      return {
        html: getWidths(document.documentElement),
        body: getWidths(document.body),
        page: getWidths(document.querySelector('#page-view')),
        left: getWidths(document.querySelector('#navigation-wrapper')),
        right: getWidths(document.querySelector('#page-wrapper'))
      }
      function getWidths(elem: Element | null): Widths {
        if (!elem) throw new Error('Elem missing')
        return {
          clientWidth: elem.clientWidth,
          scrollWidth: elem.scrollWidth
        }
      }
    })

    // Default viewport size: 1280x720
    //  - https://playwright.dev/docs/api/class-testoptions#test-options-viewport
    testWidth(layout.html, 1280)
    testWidth(layout.body, 1280)
    testWidth(layout.page, 1280)
    testWidth(layout.left, 300)
    testWidth(layout.right, 981)

    return

    type Widths = {
      clientWidth: number
      scrollWidth: number
    }

    function testWidth(widths: Widths, width: number) {
      expect(widths.clientWidth).toBe(width)
      expect(widths.scrollWidth).toBe(width)
    }
  })
}
