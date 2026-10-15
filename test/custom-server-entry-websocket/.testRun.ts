export { testRun }

import { page, test, expect, run, getServerUrl } from '@brillout/test-e2e'
import { testWebSocket, getUpgradeStatusCode } from '../utils'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview') {
  run(cmd, { serverIsReadyMessage: 'Server running at' })

  test('WebSocket', async () => {
    await page.goto(`${getServerUrl()}/`)
    expect(await page.textContent('h1')).toBe('WebSocket')
    await testWebSocket('echo: hello')
  })

  test('WebSocket connections to other paths are rejected', async () => {
    expect(await getUpgradeStatusCode('/ws')).toBe(101)
    expect(await getUpgradeStatusCode('/not-ws')).toBe(400)
  })
}
