import { build } from 'vike/api'
import { describe, expect, test } from 'vitest'

describe('build', () => {
  test('prevented', { timeout: 20 * 1000 }, async () => {
    await buildApp()
    expect('success').toBe('success')
  })
})

async function buildApp() {
  process.env.NODE_ENV = 'production'
  await build({
    viteConfig: {
      logLevel: 'warn',
      root: __dirname,
      configFile: __dirname + '/vite.config.js'
    }
  })
}
