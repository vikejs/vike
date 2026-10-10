export { testRun }

import { test, expect, fetchHtml, expectLog } from '@brillout/test-e2e'
import { testRunClassic } from '../utils'

function testRun(...args: Parameters<typeof testRunClassic>) {
  testRunClassic(...args)

  test('+server.ts route', async () => {
    expect(await fetchHtml('/hello')).toBe('Hello from +server.ts')
  })

  test('globalContext.devMiddleware', async () => {
    const isDev = args[0] === 'pnpm run dev'
    expect(await fetchHtml('/dev-middleware')).toBe(isDev ? 'set' : 'null')
    // Reading it in +server.ts warns
    if (isDev) {
      expectLog('globalContext.devMiddleware hangs the development server', {
        filter: (log) => log.logSource === 'stderr',
      })
    }
  })
}
