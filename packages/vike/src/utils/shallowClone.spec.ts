import { describe, expect, it } from 'vitest'
import { shallowClone } from './shallowClone.js'

describe('shallowClone()', () => {
  it('supports getters that need the original (e.g. a private field)', () => {
    class Example {
      #secret = 'secret'
      get secret() {
        return this.#secret
      }
      get failing(): string {
        throw new Error('failing')
      }
    }
    const clone = shallowClone(new Example())

    expect(clone.secret).toBe('secret')
    expect(clone).toBeInstanceOf(Example)
  })
})
