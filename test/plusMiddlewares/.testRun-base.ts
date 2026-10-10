export { testRun }

import { expect, fetch, getServerUrl, run, test } from '@brillout/test-e2e'

function testRun(cmd: 'pnpm run dev:base' | 'pnpm run preview:base') {
  run(cmd, {
    serverUrl: 'http://localhost:3000/app/',
    tolerateError({ logText }) {
      return logText.includes("Vite's CLI is deprecated") || logText.includes('Run the built server entry')
    },
  })

  test('A +middleware with an exact path runs under the Base URL, for the page and its .pageContext.json', async () => {
    const origin = new URL(getServerUrl()).origin
    for (const [pathname, content, status] of [
      ['/app/json-admin', 'JSON admin', 401],
      // A 404, so that the client router reloads the page
      ['/app/json-admin/index.pageContext.json', 'JSON-ADMIN', 404],
    ] as const) {
      const response: Response = await fetch(`${origin}${pathname}`)
      expect(response.status).toBe(status)
      expect(await response.text()).toBe('{"error":"unauthorized"}')
      const responseAuth: Response = await fetch(`${origin}${pathname}`, { headers: { 'x-auth': '1' } })
      expect(responseAuth.status).toBe(200)
      expect(await responseAuth.text()).toContain(content)
    }
  })
}
