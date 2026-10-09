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
      return (
        logText.includes("Vite's CLI is deprecated") ||
        logText.includes('Run the built server entry') ||
        // The browser logs the 401 of the guarded page
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
    expectLog(partRegex`HTTP response ${/.*/} /admin/settings 401`, { filter: (log) => log.logSource === 'stderr' })
    const response: Response = await fetch(`${getServerUrl()}/admin/settings`, { headers: { 'x-auth': '1' } })
    expect(response.status).toBe(200)
    expect(response.headers.get('x-settings')).toBe('yes')
    expect(await response.text()).toContain('Admin settings')
  })

  test("A +middleware with a path also guards the page's .pageContext.json (client-side navigation)", async () => {
    expect((await fetch(`${getServerUrl()}/dash`)).status).toBe(401)
    expectLog(partRegex`HTTP response ${/.*/} /dash 401`, { filter: (log) => log.logSource === 'stderr' })
    const url = `${getServerUrl()}/dash/index.pageContext.json`
    const response: Response = await fetch(url)
    expect(response.status).toBe(401)
    expect(await response.text()).toBe('Unauthorized')
    expectLog(partRegex`HTTP response ${/.*/} /dash/index.pageContext.json 401`, {
      filter: (log) => log.logSource === 'stderr',
    })
    const responseAuth: Response = await fetch(url, { headers: { 'x-auth': '1' } })
    expect(responseAuth.status).toBe(200)
    expect(await responseAuth.text()).toContain('DASH-SECRET')
  })

  test("A +middleware's own response to a .pageContext.json request is passed through", async () => {
    const response: Response = await fetch(`${getServerUrl()}/admin/settings/index.pageContext.json`)
    expect(response.status).toBe(401)
    expect(await response.text()).toBe('Unauthorized')
    expectLog(partRegex`HTTP response ${/.*/} /admin/settings/index.pageContext.json 401`, {
      filter: (log) => log.logSource === 'stderr',
    })
  })

  test("A +middleware's own response to a client-side navigation is shown", async () => {
    await page.goto(`${getServerUrl()}/`)
    await testCounter()
    await page.click('a[href="/admin/data"]')
    await autoRetry(async () => {
      expect(await page.textContent('body')).toBe('Unauthorized')
    })
    for (const pathname of ['/admin/data/index.pageContext.json', '/admin/data']) {
      expectLog(partRegex`HTTP response ${/.*/} ${pathname} 401`, { filter: (log) => log.logSource === 'stderr' })
    }
  })

  test("A +middleware's redirect of a client-side navigation is followed", async () => {
    await page.goto(`${getServerUrl()}/`)
    await testCounter()
    await page.click('a[href="/guarded"]')
    await autoRetry(async () => {
      expect(page.url()).toBe(`${getServerUrl()}/login`)
      expect(await page.textContent('body')).toContain('Login')
    })
  })

  test("A +middleware's login page, answered with status 200 to a client-side navigation, is shown", async () => {
    await page.goto(`${getServerUrl()}/`)
    await testCounter()
    await page.click('a[href="/portal"]')
    await autoRetry(async () => {
      expect(await page.textContent('body')).toBe('Log in to continue')
    })
  })

  test("A +middleware's response function can decorate or replace the response to a .pageContext.json request", async () => {
    const url = `${getServerUrl()}/wrapped/index.pageContext.json`
    const decorated: Response = await fetch(url)
    expect(decorated.status).toBe(200)
    expect(decorated.headers.get('x-wrapped')).toBe('yes')
    expect(await decorated.text()).toContain('WRAPPED-DATA')
    const replaced: Response = await fetch(url, { headers: { 'x-replace': '1' } })
    expect(replaced.status).toBe(401)
    expect(await replaced.text()).toBe('Replaced')
    expectLog(partRegex`HTTP response ${/.*/} /wrapped/index.pageContext.json 401`, {
      filter: (log) => log.logSource === 'stderr',
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
