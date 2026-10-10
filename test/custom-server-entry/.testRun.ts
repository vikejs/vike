export { testRun }

import { test, expect, fetchHtml } from '@brillout/test-e2e'
import { testRunClassic } from '../utils'

function testRun(...args: Parameters<typeof testRunClassic>) {
  testRunClassic(...args)

  test('+server.ts route', async () => {
    expect(await fetchHtml('/hello')).toBe('Hello from +server.ts')
  })

  test('globalContext.devMiddleware', async () => {
    // Vite already runs its middlewares around +server.ts (mounting them again would hang every request)
    expect(await fetchHtml('/dev-middleware')).toBe('null')
  })
}
