import { afterAll, beforeAll } from 'vitest'
import { testRun, viteConfig } from './testRun'
import { dev } from 'vike/api'

let viteServer: Awaited<ReturnType<typeof dev>>['viteServer']

beforeAll(async () => {
  const ret = await dev({ viteConfig })
  viteServer = ret.viteServer
  // Note: viteServer.listen() is already called by dev() API
  await sleep(10) // avoid race condition of server not actually being ready
}, 60 * 1000)

afterAll(async () => {
  try {
    await viteServer.close()
    // Wait for port to be fully released
    await sleep(100)
  } catch (e) {
    console.error('Error closing Vite server:', e)
  }
})

testRun()

function sleep(milliseconds: number): Promise<void> {
  return new Promise((r) => setTimeout(r, milliseconds))
}
