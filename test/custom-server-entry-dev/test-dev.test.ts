import { test, expect, fetchHtml, autoRetry, editFile, editFileRevert } from '@brillout/test-e2e'
import { sleepBeforeEditFile } from '../utils'
import { testRun } from './.testRun'

testRun('pnpm run dev')

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
