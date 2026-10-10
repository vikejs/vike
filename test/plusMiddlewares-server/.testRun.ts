export { testRun }

import { expect, fetch, getServerUrl, run, test } from '@brillout/test-e2e'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview', options?: { serverIsReadyMessage: string }) {
  run(cmd, { serverUrl: 'http://localhost:3000', ...options })

  test("A +middleware runs before the app's own routes", async () => {
    expect((await fetch(`${getServerUrl()}/api/me`)).status).toBe(401)
    const response: Response = await fetch(`${getServerUrl()}/api/me`, { headers: { 'x-user': 'alice' } })
    expect(await response.text()).toBe('Me')
  })

  test("A +middleware handler runs after the app's own routes", async () => {
    expect(await (await fetch(`${getServerUrl()}/hello`)).text()).toBe('Hello from +middleware')
    expect(await (await fetch(`${getServerUrl()}/overridden`)).text()).toBe('Overridden by +server.ts')
  })

  test("Vike's pages run last, and each +middleware runs once", async () => {
    const response: Response = await fetch(`${getServerUrl()}/`)
    expect(await response.text()).toContain('Rendered by Vike')
    expect(response.headers.get('x-middleware')).toBe('counter')
  })
}
