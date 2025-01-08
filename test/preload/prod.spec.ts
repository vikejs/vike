import { beforeAll } from 'vitest'
import { build } from 'vite'
import { testRun } from './testRun'

beforeAll(async () => {
  await buildApp()
}, 40 * 1000)

testRun(false)

async function buildApp() {
  const inlineConfig = {
    logLevel: 'warn' as const,
    root: __dirname,
    configFile: __dirname + '/vite.config.js'
  }
  await build(inlineConfig)
  await build({
    build: { ssr: true },
    ...inlineConfig
  })
}
