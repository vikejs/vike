import { describe, it } from 'vitest'
import { build } from 'vike/api'

describe('build multiple times', () => {
  it('works', { timeout: 30 * 1000 }, async () => {
    await buildApp()
    await buildApp()
  })
})

async function buildApp() {
  await build({
    vikeConfig: {
      // Skip pre-rendering as it seems to open a can of worms with Vitest
      // prerender: false,
    },
    viteConfig: {
      logLevel: 'warn' as const,
      root: __dirname,
      configFile: __dirname + '/vite.config.ts',
    },
  })
}
