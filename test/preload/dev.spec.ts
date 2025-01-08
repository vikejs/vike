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
    server: {
      middlewareMode: true,
      /* Doesn't seem to work
      hmr: false
      */
      hmr: {
        // Avoid:
        // ```
        // Error: listen EADDRINUSE: address already in use :::24678
        // ```
        port: 11323
      }
    }
  })
}
