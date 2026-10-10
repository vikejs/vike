export { testRun }

import { expect, fetch, getServerUrl, run, test } from '@brillout/test-e2e'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview', options?: { serverIsReadyMessage: string }) {
  run(cmd, { serverUrl: 'http://localhost:3000', ...options })

  test("Vike's built-in server runs the +middleware", async () => {
    const response: Response = await fetch(`${getServerUrl()}/`)
    expect(await response.text()).toContain('Rendered by Vike')
    expect(response.headers.get('x-middleware')).toBe('header')
  })

  test("Vike's pages don't answer DELETE when no +middleware is a handler", async () => {
    expect((await fetch(`${getServerUrl()}/`, { method: 'DELETE' })).status).toBe(404)
  })
}
