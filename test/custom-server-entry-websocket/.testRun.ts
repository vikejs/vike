export { testRun }

import { page, test, expect, run, getServerUrl, autoRetry } from '@brillout/test-e2e'
import http from 'node:http'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview') {
  run(cmd, { serverIsReadyMessage: 'Listening on:' })

  test('WebSocket', async () => {
    await page.goto(`${getServerUrl()}/`)
    expect(await page.textContent('h1')).toBe('WebSocket')
    await autoRetry(
      async () => {
        // Retry until the page is hydrated
        await page.click('button')
        expect(await page.textContent('#message')).toBe('echo: hello')
      },
      { timeout: 10 * 1000 },
    )
  })

  test('WebSocket connections to other paths are rejected', async () => {
    expect(await getUpgradeStatusCode('/ws')).toBe(101)
    expect(await getUpgradeStatusCode('/not-ws')).toBe(404)
  })
}

// Status code of the response to a WebSocket connection request
function getUpgradeStatusCode(pathname: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const req = http.request(`${getServerUrl()}${pathname}`, {
      headers: {
        Connection: 'Upgrade',
        Upgrade: 'websocket',
        'Sec-WebSocket-Version': '13',
        'Sec-WebSocket-Key': 'dGhlIHNhbXBsZSBub25jZQ==',
      },
    })
    req.on('upgrade', (res, socket) => {
      socket.destroy()
      resolve(res.statusCode!)
    })
    req.on('response', (res) => {
      res.resume()
      resolve(res.statusCode!)
    })
    req.on('error', reject)
    req.end()
  })
}
