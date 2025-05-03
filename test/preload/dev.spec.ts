import { beforeAll } from 'vitest'
import { createDevMiddleware } from 'vike/server'
import { testRun } from './testRun'

beforeAll(async () => {
  await devApp()
}, 20 * 1000)

testRun(true)

async function devApp() {
  await createDevMiddleware({
    root: __dirname,
    viteConfig: {
      server: {
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
    }
  })
}
