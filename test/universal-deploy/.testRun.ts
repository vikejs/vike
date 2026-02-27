export { testRun }

import { page, test, expect, getServerUrl, autoRetry, fetchHtml } from '@brillout/test-e2e'
import { testRunClassic } from '../../test/utils'

function testRun(...args: Parameters<typeof testRunClassic>) {
  testRunClassic(...args)

  test('Running on Express', async () => {
    const html = await fetchHtml('/express')
    expect(html).toContain('Running express server')
  })

  test('Add to-do item', async () => {
    await page.goto(`${getServerUrl()}/todo`)

    // Await hydration
    expect(await page.textContent('button[type="button"]')).toBe('Counter 0')
    await autoRetry(async () => {
      await page.click('button[type="button"]')
      expect(await page.textContent('button[type="button"]')).toContain('Counter 1')
    })

    // Await suspense boundary (for examples/react-streaming)
    await autoRetry(async () => {
      expect(await page.textContent('body')).toContain('Buy milk')
    })

    await page.fill('input[type="text"]', 'Buy bananas')
    await page.click('button[type="submit"]')
    await autoRetry(async () => {
      expect(await page.textContent('body')).toContain('Buy bananas')
    })
  })
}

async function getNumberOfItems() {
  return await page.evaluate(() => document.querySelectorAll('li').length)
}
