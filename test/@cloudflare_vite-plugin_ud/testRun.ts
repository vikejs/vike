export { testRun }

import { testRun as testRunCloudflare } from '../@cloudflare_vite-plugin/testRun'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview') {
  testRunCloudflare(cmd, {
    // Avoid this error: https://github.com/vikejs/vike/pull/3106#issuecomment-4206563474
    // We don't know why this is needed: https://github.com/vikejs/vike/pull/3106#issuecomment-4207829993
    sleepBeforeAboutPage: 300,
  })
}
