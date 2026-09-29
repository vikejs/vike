import { describe, expect, it } from 'vitest'
import { deepEqual } from './deepEqual.js'

describe('deepEqual()', () => {
  it('compares cyclic objects, e.g. Vite plugins', () => {
    const getPlugin = (name: string) => {
      const manager: Record<string, unknown> = {}
      manager.self = manager
      return { name, api: { manager } }
    }
    const plugin = getPlugin('a')
    expect(deepEqual(plugin, plugin)).toBe(true)
    expect(deepEqual(plugin, getPlugin('a'))).toBe(true)
    expect(deepEqual(plugin, getPlugin('b'))).toBe(false)
  })
})
