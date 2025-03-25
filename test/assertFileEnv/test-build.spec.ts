import { describe, test, assert, expect } from 'vitest'
import { build } from 'vike/api'
import { stripAnsi } from '../../vike/utils/stripAnsi'

describe('build', () => {
  test('prevented', { timeout: 40 * 1000 }, async () => {
    try {
      await buildApp()
      expect('success').toBe(false)
    } catch (err) {
      stripAnsi
      expect(stripAnsi(err.message)).toContain(
        'Server-only file /pages/index/secret.server.js (https://vike.dev/file-env) imported on the client-side by /pages/index/+Page.jsx'
      )
      return
    }
    assert(false)
  })
})

async function buildApp() {
  await build({
    viteConfig: {
      logLevel: 'warn',
      root: __dirname,
      configFile: __dirname + '/vite.config.js'
    }
  })
}
