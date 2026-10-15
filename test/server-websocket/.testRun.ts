export { testRun }

import { page, test, expect, run, getServerUrl, editFile, editFileRevert } from '@brillout/test-e2e'
import { testWebSocket, getUpgradeStatusCode, sleepBeforeEditFile } from '../utils'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview') {
  const isDev = cmd === 'pnpm run dev'
  run(cmd, isDev ? {} : { serverIsReadyMessage: 'Listening on:' })

  test('WebSocket', async () => {
    await page.goto(`${getServerUrl()}/`)
    expect(await page.textContent('h1')).toBe('WebSocket')
    await testWebSocket('echo: hello')
  })

  test('WebSocket connections to other paths are rejected', async () => {
    expect(await getUpgradeStatusCode('/ws')).toBe(101)
    expect(await getUpgradeStatusCode('/not-ws')).toBe(404)
  })

  if (isDev) {
    test('Modifying server/websocket.ts applies to new connections', async () => {
      await sleepBeforeEditFile()
      editFile('./server/websocket.ts', (s) => s.replace('`echo: ', '`modified echo: '))
      await testWebSocket('modified echo: hello')
      await sleepBeforeEditFile()
      editFileRevert()
      await testWebSocket('echo: hello')
    })
  }
}
