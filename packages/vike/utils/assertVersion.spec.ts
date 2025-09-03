import { expect, describe, it } from 'vitest'
import { isVersionOrAbove } from './assertVersion.js'

describe('isVersionOrAbove()', () => {
  it('basic version comparisons', () => {
    // Same version
    expect(isVersionOrAbove('1.0.0', ['1.0.0'])).toBe(true)

    // Higher versions (same major)
    expect(isVersionOrAbove('1.1.0', ['1.0.0'])).toBe(true)
    expect(isVersionOrAbove('1.0.1', ['1.0.0'])).toBe(true)

    // Lower versions (same major) - should fail
    expect(isVersionOrAbove('1.0.0', ['1.1.0'])).toBe(false)
    expect(isVersionOrAbove('1.0.0', ['1.0.1'])).toBe(false)

    // Different major versions
    expect(isVersionOrAbove('2.0.0', ['1.0.0'])).toBe(true) // higher major
    expect(isVersionOrAbove('1.0.0', ['2.0.0'])).toBe(false) // lower major
  })

  it('multiple expected versions', () => {
    // Must satisfy ANY of the expected versions
    expect(isVersionOrAbove('2.0.0', ['1.0.0', '2.0.0'])).toBe(true)
    expect(isVersionOrAbove('1.5.0', ['1.0.0', '1.8.0'])).toBe(true) // satisfies 1.0.0

    // Different majors
    expect(isVersionOrAbove('0.9.0', ['1.0.0', '2.0.0'])).toBe(false) // lower than all
    expect(isVersionOrAbove('5.0.0', ['1.0.0', '2.0.0'])).toBe(true) // higher than any

    expect(isVersionOrAbove('1.2.2', ['0.1.2', '1.2.3', '2.3.4'])).toBe(false)
    expect(isVersionOrAbove('1.2.3', ['0.1.2', '1.2.3', '2.3.4'])).toBe(true)
    expect(isVersionOrAbove('1.2.4', ['0.1.2', '1.2.3', '2.3.4'])).toBe(true)
  })

  it('pre-release versions', () => {
    expect(isVersionOrAbove('1.0.0-alpha', ['1.0.0'])).toBe(true)
    expect(isVersionOrAbove('1.0.0-alpha', ['1.0.1'])).toBe(false)
  })

  it('edge cases', () => {
    // Extra version parts (Git-style)
    expect(isVersionOrAbove('1.0.0.1', ['1.0.0'])).toBe(true)

    // Malformed versions
    expect(() => isVersionOrAbove('1.0', ['1.0.0'])).toThrow()
    expect(() => isVersionOrAbove('1.0.0', [])).toThrow()
  })
})
