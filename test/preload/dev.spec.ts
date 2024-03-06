import { beforeAll } from 'vitest'
import { createServer } from 'vite'
import { testRun } from './testRun'

beforeAll(async () => {
  await devApp()
}, 10 * 1000)

testRun(true)

async function devApp() {
  await createServer({
    root: __dirname,
    server: { middlewareMode: true }
  })
}
