import { afterEach, describe, expect, it } from 'vitest'
import { isToolCli } from './isToolCli.js'

const argv1 = process.argv[1]!
afterEach(() => {
  process.argv[1] = argv1
})
function isViteCli(execPath: string): boolean {
  process.argv[1] = execPath
  return isToolCli('vite')
}

describe('isToolCli()', () => {
  it('package path', () => {
    expect(isViteCli('/app/node_modules/vite/bin/vite.js')).toBe(true)
    expect(isViteCli('/app/node_modules/.pnpm/vite@7.3.1/node_modules/vite/bin/vite.js')).toBe(true)
    expect(isViteCli('C:\\app\\node_modules\\vite\\bin\\vite.js')).toBe(true)
  })
  it('symlink in node_modules/.bin/', () => {
    expect(isViteCli('/app/node_modules/.bin/vite')).toBe(true)
    expect(isViteCli('C:\\app\\node_modules\\.bin\\vite')).toBe(true)
  })
  it('other CLIs', () => {
    expect(isViteCli('/app/node_modules/.bin/vitest')).toBe(false)
    expect(isViteCli('/app/node_modules/.bin/vite-node')).toBe(false)
    expect(isViteCli('/app/node_modules/vitest/vitest.mjs')).toBe(false)
    expect(isViteCli('/app/scripts/vite/build.js')).toBe(false)
    expect(isViteCli('/app/.bin/vite')).toBe(false)
  })
})
