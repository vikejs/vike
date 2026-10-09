export { testRun }

import { expect, expectLog, fetch, getServerUrl, partRegex, run, test } from '@brillout/test-e2e'

function testRun(cmd: 'pnpm run dev:base' | 'pnpm run preview:base') {
  run(cmd, {
    serverUrl: 'http://localhost:3000/base/',
    tolerateError({ logText }) {
      return logText.includes("Vite's CLI is deprecated") || logText.includes('Run the built server entry')
    },
  })

  test('A +middleware with a path guards that path under the Base URL, and its .pageContext.json', async () => {
    const origin = new URL(getServerUrl()).origin
    for (const [pathname, content, status] of [
      ['/base/dash', 'Dash', 401],
      ['/base/dash/index.pageContext.json', 'DASH-SECRET', 404],
    ] as const) {
      const response: Response = await fetch(`${origin}${pathname}`)
      expect(response.status).toBe(status)
      expect(await response.text()).toBe('Unauthorized')
      const responseAuth: Response = await fetch(`${origin}${pathname}`, { headers: { 'x-auth': '1' } })
      expect(responseAuth.status).toBe(200)
      expect(await responseAuth.text()).toContain(content)
    }
    expectLog(partRegex`HTTP response ${/.*/} /base/dash 401`, { filter: (log) => log.logSource === 'stderr' })
  })
}
