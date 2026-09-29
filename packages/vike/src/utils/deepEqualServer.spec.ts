import { describe, expect, it } from 'vitest'
import { deepEqualServer } from './deepEqualServer.js'

describe('deepEqualServer()', () => {
  it('compares cyclic objects, e.g. Vite plugins', () => {
    const getPlugin = (name: string) => {
      const manager: Record<string, unknown> = {}
      manager.self = manager
      return { name, api: { manager } }
    }
    const plugin = getPlugin('a')
    expect(deepEqualServer(plugin, plugin)).toBe(true)
    expect(deepEqualServer(plugin, getPlugin('a'))).toBe(true)
    expect(deepEqualServer(plugin, getPlugin('b'))).toBe(false)
  })
})
