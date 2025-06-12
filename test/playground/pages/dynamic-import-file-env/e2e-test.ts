export { testDynamicImportFileEnv }

import { test, page, getServerUrl, expect, expectLog, autoRetry } from '@brillout/test-e2e'

function testDynamicImportFileEnv({ isDev }: { isDev: boolean }) {
  test('Dynamic import() of .client.js and .server.js', async () => {
    await page.goto(getServerUrl() + '/dynamic-import-file-env')
    expect(await page.textContent('body')).toContain('Dynamic import() of .client.js and .server.js')
    expectLog('hello from server', {
      filter: (log) => log.logSource === 'stdout',
      // If `isDev===false` then log is printed upon pre-rendering (not when the test is running).
      allLogs: !isDev,
    })
    await autoRetry(
      () => {
        expectLog('hello from client', { filter: (log) => log.logSource === 'Browser Log' })
      },
      { timeout: 5000 },
    )
  })
}
