import { describe, it, expect } from 'vitest'
import { build } from 'vike/api'

describe('build multiple times', () => {
  it('works', { timeout: 20 * 1000 }, async () => {
    await buildApp()
    /* TODO
    await buildApp()
    await buildApp()
    await buildApp()
    */
    expect(1).toBe(1)
  })
})

async function buildApp() {
  await build({
    viteConfig: {
      logLevel: 'warn' as const,
      root: __dirname,
      configFile: __dirname + '/vite.config.ts',
    },
  })
}
