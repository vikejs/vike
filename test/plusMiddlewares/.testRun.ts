export { testRun }

import {
  autoRetry,
  editFile,
  editFileRevert,
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
import { sleepBeforeEditFile } from '../utils'

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
    // Both adminAuth (/admin/**) and settingsHeader (/admin/settings) match. adminAuth, listed before authUser, runs after it (by
    // `order`) and sees the context it adds.
    expect((await fetch(`${getServerUrl()}/admin/settings`)).status).toBe(401)
    const response: Response = await fetch(`${getServerUrl()}/admin/settings`, { headers: { 'x-auth': '1' } })
    expect(response.status).toBe(200)
    expect(response.headers.get('x-settings')).toBe('yes')
    expect(await response.text()).toContain('Admin settings')
  })

  test('The first +middleware Response answers, with the response functions applied', async () => {
    // adminAuth answers before lateAnswer, and settingsHeader still adds its header
    const response: Response = await fetch(`${getServerUrl()}/admin/settings`, { headers: { 'x-late': '1' } })
    expect(response.status).toBe(401)
    expect(await response.text()).toBe('Unauthorized')
    expect(response.headers.get('x-settings')).toBe('yes')
  })

  test("A +middleware's path also covers the page's .pageContext.json request", async () => {
    // A 404, so that the client router reloads the page
    const url = `${getServerUrl()}/admin/settings/index.pageContext.json`
    const response: Response = await fetch(url)
    expect(response.status).toBe(404)
    expect(await response.text()).toBe('Unauthorized')
    // Vike decodes a .pageContext.json URL once more than the page's URL: /%2561dmin is /admin
    const responseEncoded: Response = await fetch(`${getServerUrl()}/%2561dmin/settings/index.pageContext.json`)
    expect(await responseEncoded.text()).toBe('Unauthorized')
    // settingsHeader's exact path, /admin/settings, also covers its .pageContext.json
    const responseAuth: Response = await fetch(url, { headers: { 'x-auth': '1' } })
    expect(responseAuth.status).toBe(200)
    expect(responseAuth.headers.get('x-settings')).toBe('yes')
  })

  test("A +middleware's answer to a client-side navigation is shown", async () => {
    for (const [pathname, answer] of [
      ['/admin/settings', 'Unauthorized'],
      ['/json-admin', '{"error":"unauthorized"}'],
    ]) {
      await page.goto(`${getServerUrl()}/`)
      await testCounter()
      await page.click(`a[href="${pathname}"]`)
      await autoRetry(async () => {
        expect(await page.textContent('body')).toBe(answer)
      })
    }
  })

  test("Vike's pages don't answer DELETE", async () => {
    expect((await fetch(`${getServerUrl()}/`, { method: 'DELETE' })).status).toBe(404)
  })

  test('A +middleware with a path and order 0 still answers its path, and the pages still render', async () => {
    expect(await (await fetch(`${getServerUrl()}/order-zero`)).text()).toBe('order zero')
    expect(await fetchHtml('/')).toContain('Rendered to HTML.')
  })

  if (cmd === 'pnpm run dev') {
    test('A +middleware that fails to load shows the error page', async () => {
      await sleepBeforeEditFile()
      editFile('./pages/+middleware.ts', (s) => `throw new Error('boom at load')\n${s}`)
      await autoRetry(
        async () => {
          // Fails instead of waiting if the server doesn't answer
          const response: Response = await fetch(`${getServerUrl()}/`, { signal: AbortSignal.timeout(5000) })
          expect(response.status).toBe(500)
        },
        { timeout: 10 * 1000 },
      )
      await sleepBeforeEditFile()
      editFileRevert()
      await autoRetry(
        async () => {
          expect(await fetchHtml('/')).toContain('Rendered to HTML.')
        },
        { timeout: 10 * 1000 },
      )
      expectLog('boom at load', { filter: (log) => log.logSource === 'stderr' })
      expectLog('Error loading Vike config', { filter: (log) => log.logSource === 'stderr' })
      expectLog(partRegex`HTTP response ${/.*/} / 500`, { filter: (log) => log.logSource === 'stderr' })
      expectLog('Vike config loaded', { filter: (log) => log.logSource === 'stderr' })
    })
  }
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
