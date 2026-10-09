export { testRun }
export { testWebSocket }

import { page, test, expect, run, getServerUrl, autoRetry } from '@brillout/test-e2e'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview') {
  run(cmd, cmd === 'pnpm run preview' ? { serverIsReadyMessage: 'Listening on:' } : {})

  test('+server.ts > upgrade()', async () => {
    await page.goto(`${getServerUrl()}/`)
    expect(await page.textContent('h1')).toBe('WebSocket')
    await testWebSocket('echo: hello')
  })
}

async function testWebSocket(expected: string) {
  await autoRetry(
    async () => {
      // Retry until the page is hydrated
      await page.click('button')
      expect(await page.textContent('#message')).toBe(expected)
    },
    { timeout: 10 * 1000 },
  )
}
