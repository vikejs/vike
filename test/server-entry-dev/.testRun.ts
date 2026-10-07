export { testRun }

import { test, expect, fetchHtml } from '@brillout/test-e2e'
import { testRunClassic } from '../utils'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview') {
  testRunClassic(cmd, {
    serverIsReadyMessage: 'Server running at',
    // TO-DO/soon: remove once https://github.com/universal-deploy/universal-deploy/pull/47 is released
    tolerateError: ({ logText }) => logText.includes('is missing "virtual:ud:catch-all" import'),
  })

  test('+serverEntry.ts route', async () => {
    expect(await fetchHtml('/hello')).toBe('Hello from +serverEntry.ts')
  })
}
