export { testRun }

import { run } from '@brillout/test-e2e'
import { testCounter } from '../../test/utils'

import { test, page, getServerUrl, expectLog } from '@brillout/test-e2e'

function testRun(cmd: 'npm run dev' | 'npm run preview') {
  run(cmd, { doNotFailOnWarning: true })

  test('forbidden import', async () => {
    await page.goto(getServerUrl() + '/')
    await testCounter()
    expectLog(
      `Server-only module /pages/index/+Page.server.jsx (https://vike.dev/file-env) imported on the client-side (building your app for production will be prevented and an error will be thrown).`,
      (log) => log.logSource === 'stderr'
    )
    expectLog(
      'Client-only module /pages/index/Counter.client.jsx (https://vike.dev/file-env) imported on the server-side by /pages/index/+Page.server.jsx (building your app for production will be prevented and an error will be thrown).',
      (log) => log.logSource === 'stderr'
    )
  })
}
