export { testRun }

import { run, page, test, expect, getServerUrl, fetchHtml, autoRetry } from '@brillout/test-e2e'
import { ensureWasClientSideRouted, testCounter } from '../../test/utils'

function testRun(cmd: 'npm run dev' | 'npm run prod') {
  run(cmd)

  test('Basics', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<h1>Welcome</h1>')
    expect(html).toContain('You are logged out.')
    await page.goto(getServerUrl() + '/')
    await testCounter()
  })

  test('Account page -> login', async () => {
    await page.click('a[href="/account"]')
    await autoRetry(async () => {
      expect(await page.textContent('h1')).not.toBe('Welcome')
    })
    await ensureWasClientSideRouted('/pages/index')
    expect(await page.textContent('h1')).toBe('Log in')
    const btn = page.locator('button', { hasText: 'Neumann' })
    await btn.click()
    expect(await page.textContent('body')).toContain('You are logged out.')
    await page.click('button:has-text("Login")')
    await autoRetry(async () => {
      expect(await page.textContent('h1')).toBe('Account')
    })
    expect(await page.textContent('body')).toContain('Logged as John von Neumann')
    expect(await page.textContent('body')).toContain("You're able to access this page because you're logged in.")
    await testCounter()
    await ensureWasClientSideRouted('/pages/index')
  })

  test('Admin page -> unauthorized', async () => {
    await page.click('a[href="/admin"]')
    await autoRetry(async () => {
      expect(await page.textContent('h1')).toBe('Unauthorized')
    })
    expect(await page.textContent('body')).toContain("You cannot access this page because you aren't an administrator.")
    await testCounter()
    await ensureWasClientSideRouted('/pages/index')
  })

  test('Login as Alan Turing', async () => {
    await page.click('button:has-text("Logout")')
    await autoRetry(async () => {
      expect(await page.textContent('body')).toContain('You are logged out.')
    })
    expect(await page.textContent('h1')).toBe('Log in')
    const btn = page.locator('button', { hasText: 'Turing' })
    await btn.click()
    await page.click('button:has-text("Login")')
    await autoRetry(async () => {
      expect(await page.textContent('h1')).toBe('Admin Panel')
    })
    expect(await page.textContent('body')).toContain(
      "You're able to access this page because you're logged in as Alan Turing.",
    )
    await testCounter()
    await ensureWasClientSideRouted('/pages/index')
  })
}
