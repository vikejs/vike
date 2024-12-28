export { testDynamicImportFileEnv }

import { test, page, getServerUrl, expect, expectLog, autoRetry } from '@brillout/test-e2e'

function testDynamicImportFileEnv() {
  test('Dynamic import() of .client.js and .server.js', async () => {
    await page.goto(getServerUrl() + '/dynamic-import-file-env')
    expect(await page.textContent('body')).toContain('Dyanmic import() of .client.js and .server.js')
    expectLog('hello from server', (log) => log.logSource === 'stdout')
    await autoRetry(
      () => {
        expectLog('hello from client', (log) => log.logSource === 'Browser Log')
      },
      { timeout: 5000 }
    )
  })
}
