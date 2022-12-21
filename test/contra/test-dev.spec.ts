import { beforeAll } from 'vitest'
import { createServer } from 'vite'
import { test } from './test'

beforeAll(async () => {
  await devApp()
}, 10 * 1000)

test()

async function devApp() {
  await createServer({
    root: __dirname,
    server: { middlewareMode: true }
  })
}
