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

  test('a module imported by both +serverEntry.ts and a page is evaluated only once', async () => {
    // Loads pages/about/+data.ts
    await fetchHtml('/about')
    expect(await fetchHtml('/shared-module-evaluations')).toBe('1')
  })

  if (isDev) {
    test('+serverEntry.ts is re-run upon modification of a file it imports', async () => {
      const org = 'Hello from +serverEntry.ts'
      const mod = 'Hello from modified +serverEntry.ts'
      // autoRetry() because the server restarts
      const expectHello = (hello: string) =>
        autoRetry(
          async () => {
            expect(await fetchHtml('/hello')).toBe(hello)
          },
          { timeout: 10 * 1000 },
        )
      await expectHello(org)
      await sleepBeforeEditFile()
      editFile('./server/hello.ts', (s) => s.replace(org, mod))
      await expectHello(mod)
      await sleepBeforeEditFile()
      editFileRevert()
      await expectHello(org)
    })
  }
}
