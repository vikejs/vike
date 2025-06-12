import { beforeAll } from 'vitest'
import { build } from 'vike/api'
import { testRun } from './testRun'

beforeAll(async () => {
  await buildApp()
}, 40 * 1000)

testRun(false)

async function buildApp() {
  await build({
    viteConfig: {
      logLevel: 'warn' as const,
      root: __dirname,
      configFile: __dirname + '/vite.config.js',
    },
  })
}
