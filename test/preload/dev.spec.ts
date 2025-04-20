import { beforeAll } from 'vitest'
import { dev } from 'vike/api'
import { testRun } from './testRun'

beforeAll(async () => {
  await devApp()
}, 10 * 1000)

testRun(true)

async function devApp() {
  await dev({
    viteConfig: {
      root: __dirname,
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
