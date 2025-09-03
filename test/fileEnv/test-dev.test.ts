import { run } from '@brillout/test-e2e'
import { testCounter } from '../../test/utils'

import { test, page, getServerUrl, expectLog } from '@brillout/test-e2e'

run('npm run dev', { tolerateError: true })

test('forbidden import', async () => {
  await page.goto(getServerUrl() + '/')
  await testCounter()
  expectLog(
    'Server-only file /pages/index/secret.server.js (https://vike.dev/file-env) imported on the client-side by /pages/index/+Page.jsx and, therefore, Vike will prevent building your app for production.',
    { filter: (log) => log.logSource === 'stderr' },
  )
  expectLog(
    'Client-only file /pages/index/Counter.client.jsx (https://vike.dev/file-env) imported on the server-side by /pages/index/+Page.jsx and, therefore, Vike will prevent building your app for production.',
    { filter: (log) => log.logSource === 'stderr' },
  )
})
