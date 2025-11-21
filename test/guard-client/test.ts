export { testRun as test }

import { run, page, test, expect, getServerUrl, autoRetry } from '@brillout/test-e2e'

function testRun(cmd: 'npm run dev' | 'npm run preview') {
  run(cmd)

  test('client-side guard executes on page reload', async () => {
    // Navigate to the page via direct URL (page reload scenario)
    await page.goto(getServerUrl() + '/')

    // Wait for hydration and guard execution
    await autoRetry(async () => {
      const guardExecuted = await page.evaluate(() => (window as any).__GUARD_EXECUTED__)
      expect(guardExecuted).toBe(true)
    })

    const guardExecutedOn = await page.evaluate(() => (window as any).__GUARD_EXECUTED_ON__)
    expect(guardExecutedOn).toBe('client')

    // Check that the page shows guard was executed
    expect(await page.textContent('p:nth-of-type(1)')).toBe('Guard executed: Yes')
    expect(await page.textContent('p:nth-of-type(2)')).toBe('Guard executed on: client')
  })

  test('client-side guard executes on client-side navigation', async () => {
    // Start from home page
    await page.goto(getServerUrl() + '/')

    // Clear the guard execution flag
    await page.evaluate(() => {
      ;(window as any).__GUARD_EXECUTED__ = false
      ;(window as any).__GUARD_EXECUTED_ON__ = null
    })

    // Navigate to about page via client-side routing
    await page.click('a[href="/about"]')

    // Wait for navigation and guard execution
    await autoRetry(async () => {
      const guardExecuted = await page.evaluate(() => (window as any).__GUARD_EXECUTED__)
      expect(guardExecuted).toBe(true)
    })

    const guardExecutedOn = await page.evaluate(() => (window as any).__GUARD_EXECUTED_ON__)
    expect(guardExecutedOn).toBe('client')

    // Check that the about page shows guard was executed
    expect(await page.textContent('p:nth-of-type(1)')).toBe('Guard executed: Yes')
    expect(await page.textContent('p:nth-of-type(2)')).toBe('Guard executed on: client')
  })
}
