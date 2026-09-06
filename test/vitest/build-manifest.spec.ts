import { describe, test, assert, expect } from 'vitest'
import { build } from 'vike/api'
import { viteConfig } from './testRun'

// https://github.com/vikejs/vike/issues/3505
describe('build', () => {
  test('build.manifest cannot be set to false', { timeout: 40 * 1000 }, async () => {
    try {
      await build({ viteConfig: { ...viteConfig, build: { manifest: false } } })
      expect('success').toBe(false)
    } catch (err) {
      assert(err instanceof Error)
      expect(stripAnsi(err.message)).toContain(
        "[Wrong Usage] Setting Vite's configuration build.manifest to false is forbidden: Vike needs Vite's manifest to determine the assets of each page.",
      )
      return
    }
    assert(false)
  })
})

// We don't import stripAnsi() from Vike's source code: it would make the TypeScript check of this directory include Vike's source code.
function stripAnsi(str: string) {
  const esc = String.fromCharCode(27)
  return str.replace(new RegExp(esc + '\\[[0-9;]*m', 'g'), '')
}
