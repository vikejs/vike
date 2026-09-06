import { describe, test, assert, expect } from 'vitest'
import { build } from 'vike/api'
import { stripAnsi } from '../../packages/vike/src/utils/colorsServer'
import { viteConfig } from './testRun'

// https://github.com/vikejs/vike/issues/3505
describe('build', () => {
  test('build.manifest cannot be set to false', { timeout: 40 * 1000 }, async () => {
    try {
      await build({ viteConfig: { ...viteConfig, build: { manifest: false } } })
      expect('success').toBe(false)
    } catch (err) {
      expect(stripAnsi(err.message)).toContain(
        "[Wrong Usage] Setting Vite's configuration build.manifest to false is forbidden: Vike needs Vite's manifest to determine the assets of each page.",
      )
      return
    }
    assert(false)
  })
})
