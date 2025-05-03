import { afterAll, beforeAll } from 'vitest'
import { testRun, viteConfig } from './testRun'
import { dev } from 'vike/api'

let viteServer: Awaited<ReturnType<typeof dev>>['viteServer']

beforeAll(async () => {
  const ret = await dev({ viteConfig })
  viteServer = ret.viteServer
  await viteServer.listen()
  viteServer.printUrls()
  await sleep(10) // avoid race condition of server not actually being ready
}, 20 * 1000)

afterAll(async () => {
  try {
    await viteServer.close()
  } catch (e) {
    console.error('Error closing Vite server:', e)
  }
})

testRun()

function sleep(milliseconds: number): Promise<void> {
  return new Promise((r) => setTimeout(r, milliseconds))
}
