export { testRun }

import {
  autoRetry,
  editFile,
  editFileRevert,
  expect,
  expectLog,
  fetch,
  getServerUrl,
  run,
  test,
} from '@brillout/test-e2e'
import { sleepBeforeEditFile } from '../utils'

type Cmd = 'pnpm run dev' | 'pnpm run preview' | 'pnpm run dev:halves' | 'pnpm run preview:halves'

function testRun(cmd: Cmd, options?: { serverIsReadyMessage: string }) {
  run(cmd, { serverUrl: 'http://localhost:3000', ...options })

  test("A +middleware runs before the app's own routes, in its order and with the context of the ones before it", async () => {
    // `counter`, ordered after `auth`, doesn't run once `auth` answers
    const unauthorized: Response = await fetch(`${getServerUrl()}/api/me`)
    expect(unauthorized.status).toBe(401)
    expect(unauthorized.headers.get('x-middleware')).toBe(null)
    const response: Response = await fetch(`${getServerUrl()}/api/me`, { headers: { 'x-user': 'alice' } })
    expect(await response.text()).toBe('Me')
  })

  test("A +middleware's context adds to the context of the ones before it", async () => {
    // `locale`, ordered between `user` and `auth`, keeps the user
    const response: Response = await fetch(`${getServerUrl()}/`, { headers: { 'x-user': 'alice' } })
    expect(await response.text()).toContain('Rendered by Vike for alice with the hono runtime in en')
    expect((await fetch(`${getServerUrl()}/api/me`, { headers: { 'x-user': 'alice' } })).status).toBe(200)
  })

  test("A +middleware handler runs after the app's own routes", async () => {
    expect(await (await fetch(`${getServerUrl()}/hello`)).text()).toBe('Hello from +middleware')
    expect(await (await fetch(`${getServerUrl()}/overridden`)).text()).toBe('Overridden by +server.ts')
  })

  test("Vike's pages run last with the +middleware's context, and each +middleware runs once", async () => {
    const response: Response = await fetch(`${getServerUrl()}/`)
    expect(await response.text()).toContain('Rendered by Vike')
    expect(response.headers.get('x-middleware')).toBe('counter')
    const responseUser: Response = await fetch(`${getServerUrl()}/`, { headers: { 'x-user': 'alice' } })
    expect(await responseUser.text()).toContain('Rendered by Vike for alice')
  })

  test("Vike's pages don't answer DELETE", async () => {
    expect((await fetch(`${getServerUrl()}/`, { method: 'DELETE' })).status).toBe(404)
  })

  test("`vike.fetch(request)` answers a request passed alone, with Vike's 'other' runtime", async () => {
    const text = await (await fetch(`${getServerUrl()}/vike-fetch`)).text()
    expect(text).toContain('Rendered by Vike with the other runtime')
    const html = await (await fetch(`${getServerUrl()}/`)).text()
    expect(html).toContain('Rendered by Vike with the hono runtime')
    expect(html).not.toContain('adapter')
  })

  test("`vike.fetch()` doesn't add a +middleware's context to a context shared by all requests", async () => {
    const url = `${getServerUrl()}/shared-context`
    expect(await (await fetch(url, { headers: { 'x-user': 'alice' } })).text()).toContain('Rendered by Vike for alice')
    expect(await (await fetch(url)).text()).not.toContain('for alice')
  })

  test("The app's own renderPage() call gets a 500, as the +middleware may not have run", async () => {
    expect((await fetch(`${getServerUrl()}/render-page`)).status).toBe(500)
    expectLog("renderPage() doesn't run your +middleware, see https://vike.dev/warning/setup-middlewares", {
      filter: (log) => log.logSource === 'stderr',
    })
  })

  test("A +middleware's own renderPage() call gets a 500", async () => {
    const response: Response = await fetch(`${getServerUrl()}/`, { headers: { 'x-render': '1' } })
    expect(response.status).toBe(500)
    expectLog("renderPage() doesn't run your +middleware, see https://vike.dev/warning/setup-middlewares", {
      filter: (log) => log.logSource === 'stderr',
    })
  })

  if (cmd === 'pnpm run dev:halves' || cmd === 'pnpm run preview:halves') {
    test("The user-land universal middlewares apply to a +middleware's answer, and a Response after it is ignored", async () => {
      // `auth` answers, and `late`, ordered after it, returns a Response too
      const response: Response = await fetch(`${getServerUrl()}/api/me`, { headers: { 'x-late': '1' } })
      expect(response.status).toBe(401)
      expect(await response.text()).toBe('Unauthorized')
      expect(response.headers.get('x-app')).toBe('yes')
      // apiHeader's path, /api/**, matches
      expect(response.headers.get('x-api')).toBe('yes')
    })

    test("A user-land handler runs after the app's own routes", async () => {
      expect(await (await fetch(`${getServerUrl()}/user-land/hello`)).text()).toBe('Hello from a user-land handler')
      expect(await (await fetch(`${getServerUrl()}/user-land/overridden`)).text()).toBe('Overridden by +server.ts')
    })

    test('A user-land universal middleware runs by its order between the +middleware, and only on its path', async () => {
      const response: Response = await fetch(`${getServerUrl()}/`, { headers: { 'x-user': 'alice' } })
      expect(await response.text()).toContain('Rendered by Vike for alice')
      expect(response.headers.get('x-app')).toBe('yes')
      // Ordered after the `user` +middleware: it sees the user
      expect(response.headers.get('x-user-seen')).toBe('alice')
      expect(response.headers.get('x-api')).toBe(null)
    })
  }

  if (cmd === 'pnpm run dev:halves') {
    test("Upon an invalid config, Vike's error page answers instead of the app's routes", async () => {
      const me = () =>
        fetch(`${getServerUrl()}/api/me`, { headers: { 'x-user': 'alice' }, signal: AbortSignal.timeout(5000) })
      await sleepBeforeEditFile()
      editFile('./pages/+middleware.ts', (s) => `throw new Error('boom at load')\n${s}`)
      await autoRetry(
        async () => {
          expect((await me()).status).toBe(500)
        },
        { timeout: 15 * 1000 },
      )
      await sleepBeforeEditFile()
      editFileRevert()
      await autoRetry(
        async () => {
          expect(await (await me()).text()).toBe('Me')
        },
        { timeout: 10 * 1000 },
      )
      expectLog('boom at load', { filter: (log) => log.logSource === 'stderr' })
      expectLog('Vike config loaded', { filter: (log) => log.logSource === 'stderr' })
    })
  }
}
