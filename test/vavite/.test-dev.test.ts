import { test, expect, getServerUrl, editFile, editFileRevert, autoRetry, expectLog, page } from '@brillout/test-e2e'
import { testRunClassic, sleepBeforeEditFile } from '../utils'

testRunClassic('pnpm run dev')

test('+middleware', async () => {
  const response = await fetch(getServerUrl() + '/')
  expect(response.headers.get('x-middleware')).toBe('ran')
})

test('+middleware context reaches routes after getUniversalMiddlewares()', async () => {
  const response = await fetch(getServerUrl() + '/api/context')
  expect((await response.json()).testMiddlewareContext).toBe('from +middleware')
})

test('an erroneous config fails the request instead of skipping +middleware', async () => {
  // Leave the page, which would otherwise reload into the broken config while Vite restarts
  await page.goto('about:blank')
  await sleepBeforeEditFile()
  editFile('./pages/+config.ts', (s) => s + "\nthrow new Error('broken config')\n")
  await autoRetry(
    async () => {
      // A request sent before Vike noticed the edit waits for the reloaded config
      const response = await fetch(getServerUrl() + '/api/context', { signal: AbortSignal.timeout(2000) })
      expect(response.status).toBe(500)
      expect(await response.text()).not.toContain('testMiddlewareContext')
    },
    { timeout: 10 * 1000 },
  )
  await sleepBeforeEditFile()
  editFileRevert()
  await autoRetry(
    async () => {
      const response = await fetch(getServerUrl() + '/api/context')
      expect((await response.json()).testMiddlewareContext).toBe('from +middleware')
    },
    { timeout: 10 * 1000 },
  )
  // The logs of the broken config
  expectLog('Failed to execute /pages/+config.ts')
  expectLog('Error loading Vike config')
  expectLog('Vike config loaded', { filter: (log) => log.logSource === 'stderr' })
})
