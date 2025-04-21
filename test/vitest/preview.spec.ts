import { afterAll, beforeAll } from 'vitest'
import { testRun, viteConfig } from './testRun'
import { build, preview } from 'vike/api'

let viteServer: Awaited<ReturnType<typeof preview>>['viteServer']

beforeAll(async () => {
  await build({ viteConfig })
  const ret = await preview({ viteConfig })
  viteServer = ret.viteServer
  viteServer!.printUrls()
}, 40 * 1000)

afterAll(async () => {
  try {
    await viteServer!.close()
  } catch (e) {
    console.error('Error closing Vite server:', e)
  }
})

testRun()
