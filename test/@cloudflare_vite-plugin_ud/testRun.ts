export { testRun }

import { expect, fetchHtml, test } from '@brillout/test-e2e'
import { testRun as testRunCloudflare } from '../@cloudflare_vite-plugin/testRun'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview') {
  testRunCloudflare(cmd, {
    // Avoid this error: https://github.com/vikejs/vike/pull/3106#issuecomment-4206563474
    // We don't know why this is needed: https://github.com/vikejs/vike/pull/3106#issuecomment-4207829993
    sleepBeforeAboutPage: 300,
  })

  test("The worker's ExecutionContext isn't a server's runtime: the page gets no runtime, req or res", async () => {
    expect(await fetchHtml('/runtime')).toContain('runtime: false, req: false, res: false')
  })
}
