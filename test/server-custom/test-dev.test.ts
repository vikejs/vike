import { test, expect, fetchHtml, autoRetry, editFile, editFileRevert } from '@brillout/test-e2e'
import { sleepBeforeEditFile } from '../utils'
import { testRun } from './.testRun'

testRun('pnpm run dev')

test('+server.ts HMR', async () => {
  const org = 'Hello from Express'
  const mod = 'Hello from modified Express'
  expect(await fetchHtml('/hello')).toBe(org)
  await sleepBeforeEditFile()
  editFile('./+server.ts', (s) => s.replace(org, mod))
  await autoRetry(
    async () => {
      expect(await fetchHtml('/hello')).toBe(mod)
    },
    { timeout: 5000 },
  )
  await sleepBeforeEditFile()
  editFileRevert()
  await autoRetry(
    async () => {
      expect(await fetchHtml('/hello')).toBe(org)
    },
    { timeout: 5000 },
  )
})
