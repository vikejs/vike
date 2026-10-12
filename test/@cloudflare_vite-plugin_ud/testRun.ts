export { testRun }

import { expect, fetchHtml, test } from '@brillout/test-e2e'
import { testRun as testRunCloudflare } from '../@cloudflare_vite-plugin/testRun'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview') {
  testRunCloudflare(cmd, {
    // Avoid this error: https://github.com/vikejs/vike/pull/3106#issuecomment-4206563474
    // We don't know why this is needed: https://github.com/vikejs/vike/pull/3106#issuecomment-4207829993
    sleepBeforeAboutPage: 300,
  })

  test("The page gets the worker's ExecutionContext as its runtime, and req and res as null", async () => {
    expect(await fetchHtml('/runtime')).toContain('runtime: true, req: null, res: null')
  })
}
