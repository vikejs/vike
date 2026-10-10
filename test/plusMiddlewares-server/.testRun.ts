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

  test('`vike.fetch(request)` answers a request passed alone', async () => {
    expect(await (await fetch(`${getServerUrl()}/vike-fetch`)).text()).toContain('Rendered by Vike')
  })

  test("`vike.fetch()` doesn't add a +middleware's context to a context shared by all requests", async () => {
    const url = `${getServerUrl()}/shared-context`
    expect(await (await fetch(url, { headers: { 'x-user': 'alice' } })).text()).toContain('Rendered by Vike for alice')
    expect(await (await fetch(url)).text()).not.toContain('for alice')
  })

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
