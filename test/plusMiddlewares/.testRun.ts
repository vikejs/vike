export { testRun }

import { autoRetry, expect, fetch, fetchHtml, getServerUrl, page, run, test } from '@brillout/test-e2e'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview') {
  run(cmd, {
    serverUrl: 'http://localhost:3000',
    tolerateError({ logText }) {
      return (
        logText.includes("Vite's CLI is deprecated") ||
        logText.includes('Run the built server entry') ||
        // The browser logs the 404 of /admin/settings/index.pageContext.json, then the 401 of /admin/settings
        logText.includes('the server responded with a status of 404') ||
        logText.includes('the server responded with a status of 401')
      )
    },
  })

  test('HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('Rendered to HTML.')
  })

  test('DOM', async () => {
    await page.goto(`${getServerUrl()}/`)

    await testCounter()
  })

  test('Middlewares', async () => {
    const response: Response = await fetch(`${getServerUrl()}/middleware`)

    expect(response.status).toBe(200)
    expect(await response.text()).toBe('OK')
  })

  test('Middleware returning a redirect (3xx) Response', async () => {
    const response: Response = await fetch(`${getServerUrl()}/redirect-middleware`, { redirect: 'manual' })

    expect(response.status).toBe(303)
    expect(response.headers.get('Location')).toBe('/')
  })

  test('Every +middleware whose path matches runs, then the page', async () => {
    // Both adminAuth (/admin/**) and settingsHeader (/admin/settings) match
    expect((await fetch(`${getServerUrl()}/admin/settings`)).status).toBe(401)
    const response: Response = await fetch(`${getServerUrl()}/admin/settings`, { headers: { 'x-auth': '1' } })
    expect(response.status).toBe(200)
    expect(response.headers.get('x-settings')).toBe('yes')
    expect(await response.text()).toContain('Admin settings')
  })

  test("A +middleware's path also covers the page's .pageContext.json request", async () => {
    // A 404, so that the client router reloads the page
    const response: Response = await fetch(`${getServerUrl()}/admin/settings/index.pageContext.json`)
    expect(response.status).toBe(404)
    expect(await response.text()).toBe('Unauthorized')
  })

  test("A +middleware's answer to a client-side navigation is shown", async () => {
    await page.goto(`${getServerUrl()}/`)
    await testCounter()
    await page.click('a[href="/admin/settings"]')
    await autoRetry(async () => {
      expect(await page.textContent('body')).toBe('Unauthorized')
    })
  })

  test('A +middleware with a path and order 0 still answers its path, and the pages still render', async () => {
    expect(await (await fetch(`${getServerUrl()}/order-zero`)).text()).toBe('order zero')
    expect(await fetchHtml('/')).toContain('Rendered to HTML.')
  })
}

async function testCounter() {
  // autoRetry() for awaiting client-side code loading & executing
  await autoRetry(
    async () => {
      expect(await page.textContent('button')).toBe('Counter 0')
      await page.click('button')
      expect(await page.textContent('button')).toContain('Counter 1')
    },
    { timeout: 5 * 1000 },
  )
}
