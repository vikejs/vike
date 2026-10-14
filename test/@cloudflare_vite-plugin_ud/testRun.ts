export { testRun }

import { expectLog, getServerUrl, page, test } from '@brillout/test-e2e'
import { testRun as testRunCloudflare } from '../@cloudflare_vite-plugin/testRun'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview') {
  test('`vike/fetch` deprecation warning', async () => {
    await page.goto(getServerUrl() + '/')
    expectLog("import vike from 'vike/fetch' is deprecated, see https://vike.dev/migration/vike-fetch")
  })
  testRunCloudflare(cmd, {
    // Avoid this error: https://github.com/vikejs/vike/pull/3106#issuecomment-4206563474
    // We don't know why this is needed: https://github.com/vikejs/vike/pull/3106#issuecomment-4207829993
    sleepBeforeAboutPage: 300,
  })
}
