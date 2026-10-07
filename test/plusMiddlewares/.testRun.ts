export { testRun }

import {
  autoRetry,
  expect,
  expectLog,
  fetch,
  fetchHtml,
  getServerUrl,
  page,
  partRegex,
  run,
  test,
} from '@brillout/test-e2e'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview') {
  run(cmd, {
    serverUrl: 'http://localhost:3000',
    tolerateError({ logText }) {
      return logText.includes("Vite's CLI is deprecated") || logText.includes('Run the built server entry')
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
    // Both adminAuth (/admin/**) and settingsHeader (/admin/settings) match /admin/settings
    expect((await fetch(`${getServerUrl()}/admin/settings`)).status).toBe(401)
    expectLog(partRegex`HTTP response ${/.*/} /admin/settings 401`, { filter: (log) => log.logSource === 'stderr' })
    const response: Response = await fetch(`${getServerUrl()}/admin/settings`, { headers: { 'x-auth': '1' } })
    expect(response.status).toBe(200)
    expect(response.headers.get('x-settings')).toBe('yes')
    expect(await response.text()).toContain('Admin settings')
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
