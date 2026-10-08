export { testRun }

import { test, expect, fetchHtml, autoRetry, editFile, editFileRevert } from '@brillout/test-e2e'
import { testRunClassic, sleepBeforeEditFile } from '../utils'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview') {
  const isDev = cmd === 'pnpm run dev'

  testRunClassic(cmd, {
    serverIsReadyMessage: 'Server running at',
  })

  test('+serverEntry.ts route', async () => {
    expect(await fetchHtml('/hello')).toBe('Hello from +serverEntry.ts')
  })

  if (isDev) {
    test('+serverEntry.ts is re-run upon modification of a file it imports', async () => {
      const org = 'Hello from +serverEntry.ts'
      const mod = 'Hello from modified +serverEntry.ts'
      expect(await fetchHtml('/hello')).toBe(org)
      await sleepBeforeEditFile()
      editFile('./server/hello.ts', (s) => s.replace(org, mod))
      await autoRetry(
        async () => {
          expect(await fetchHtml('/hello')).toBe(mod)
        },
        { timeout: 10 * 1000 },
      )
      await sleepBeforeEditFile()
      editFileRevert()
      await autoRetry(
        async () => {
          expect(await fetchHtml('/hello')).toBe(org)
        },
        { timeout: 10 * 1000 },
      )
    })
  }
}
