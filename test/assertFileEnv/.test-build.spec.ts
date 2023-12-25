import { describe, test, assert, expect } from 'vitest'
import { build } from 'vite'
import { stripAnsi } from '../../vike/utils/stripAnsi'

describe('build', () => {
  test(
    'prevented',
    async () => {
      try {
        await buildApp()
        expect('success').toBe(false)
      } catch (err) {
        stripAnsi
        expect(stripAnsi(err.message)).toContain(
          'Server-only module /pages/index/+Page.server.jsx (https://vike.dev/file-env) imported on the client-side.'
        )
        return
      }
      assert(false)
    },
    { timeout: 20 * 1000 }
  )
})

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
