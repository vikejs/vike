import { describe, it, expect, beforeEach, assert } from 'vitest'
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
    preservePropertyGetters(testObj)
    expect(Object.keys(testObj)).not.toContain('computed') // Now non-enumerable
    const copy = { ...testObj } // Spread without getter

    expect(copy.computed).toBeUndefined()
    assert('_restorePropertyGetters' in copy)
    ;(copy as any)._restorePropertyGetters()
    assert(!('_restorePropertyGetters' in (copy as any)))

    expect(copy.computed).toBe(20) // Getter works
    copy.value = 5
    expect(copy.computed).toBe(10) // Reacts to changes
  })

  it('preserves normal properties', () => {
    preservePropertyGetters(testObj)
    const copy = { ...testObj }
    ;(copy as any)._restorePropertyGetters()

    expect(copy.normal).toBe('plain property')
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

    preservePropertyGetters(multiObj)
    const copy = { ...multiObj }
    ;(copy as any)._restorePropertyGetters()

    expect(copy.sum).toBe(3)
    expect(copy.product).toBe(2)
  })
})
