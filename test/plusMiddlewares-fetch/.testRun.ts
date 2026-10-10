export { testRun }

import { expect, fetch, getServerUrl, run, test } from '@brillout/test-e2e'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview', options?: { serverIsReadyMessage: string }) {
  run(cmd, { serverUrl: 'http://localhost:3000', ...options })

  test("Vike's built-in server runs the +middleware", async () => {
    const response: Response = await fetch(`${getServerUrl()}/`)
    expect(await response.text()).toContain('Rendered by Vike')
    expect(response.headers.get('x-middleware')).toBe('header')
  })

  test("Vike's pages answer a method they don't list (PROPFIND) when no +middleware is a handler", async () => {
    const response: Response = await fetch(`${getServerUrl()}/`, { method: 'PROPFIND' })
    expect(response.status).toBe(200)
    expect(await response.text()).toContain('Rendered by Vike')
  })
}
