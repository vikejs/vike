export { testRun }

import { test, expect, fetchHtml } from '@brillout/test-e2e'
import { testRunClassic } from '../utils'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview') {
  testRunClassic(cmd, {
    serverIsReadyMessage: 'Server running at',
  })

  test('+serverEntry.ts route', async () => {
    expect(await fetchHtml('/hello')).toBe('Hello from +serverEntry.ts')
  })
}
