import { describe, it, expect, beforeEach } from 'vitest'
import { preservePropertyGetters } from './preservePropertyGetters.js'

describe('preservePropertyGetters', () => {
  let testObj: {
    value: number
    get computed(): number
    normal: string
  }

  beforeEach(() => {
    testObj = {
      value: 10,
      get computed() {
        return this.value * 2
      },
      normal: 'plain property'
    }
  })

  it('restores getters to copied object', () => {
    const { restorePropertyGetters } = preservePropertyGetters(testObj)
    expect(Object.keys(testObj)).not.toContain('computed') // Now non-enumerable
    const copy = { ...testObj } // Spread without getter

    expect(copy.computed).toBeUndefined()
    const restored = restorePropertyGetters(copy)

    expect(restored.computed).toBe(20) // Getter works
    restored.value = 5
    expect(restored.computed).toBe(10) // Reacts to changes
  })

  it('preserves normal properties', () => {
    const { restorePropertyGetters } = preservePropertyGetters(testObj)
    const copy = { ...testObj }
    const restored = restorePropertyGetters(copy)

    expect(restored.normal).toBe('plain property')
  })

  it('handles multiple getters', () => {
    const multiObj = {
      a: 1,
      b: 2,
      get sum() {
        return this.a + this.b
      },
      get product() {
        return this.a * this.b
      }
    }

    const { restorePropertyGetters } = preservePropertyGetters(multiObj)
    const copy = { ...multiObj }
    const restored = restorePropertyGetters(copy)

    expect(restored.sum).toBe(3)
    expect(restored.product).toBe(2)
  })
})
