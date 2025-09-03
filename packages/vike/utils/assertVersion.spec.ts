import { expect, describe, it } from 'vitest'
import { isVersionMatch } from './assertVersion.js'

describe('isVersionMatch()', () => {
  it('basic version comparisons', () => {
    // Same version
    expect(isVersionMatch('1.0.0', ['1.0.0'])).toBe(true)

    // Higher versions (same major)
    expect(isVersionMatch('1.0.1', ['1.0.0'])).toBe(true)
    expect(isVersionMatch('1.1.0', ['1.0.0'])).toBe(true)

    // Lower versions (same major) - should fail
    expect(isVersionMatch('1.0.0', ['1.1.0'])).toBe(false)
    expect(isVersionMatch('1.0.0', ['1.0.1'])).toBe(false)

    // Different major versions
    expect(isVersionMatch('2.0.0', ['1.0.0'])).toBe(true)
    expect(isVersionMatch('1.0.0', ['2.0.0'])).toBe(false)
  })

  it('multiple expected versions', () => {
    expect(isVersionMatch('1.2.3', ['1.2.3', '2.3.4'])).toBe(true)
    expect(isVersionMatch('1.2.4', ['1.2.3', '2.3.4'])).toBe(true)
    expect(isVersionMatch('1.3.3', ['1.2.3', '2.3.4'])).toBe(true)
    expect(isVersionMatch('1.2.2', ['1.2.3', '2.3.4'])).toBe(false)

    expect(isVersionMatch('2.3.4', ['1.2.3', '2.3.4'])).toBe(true)
    expect(isVersionMatch('2.3.5', ['1.2.3', '2.3.4'])).toBe(true)
    expect(isVersionMatch('2.4.4', ['1.2.3', '2.3.4'])).toBe(true)
    expect(isVersionMatch('2.3.3', ['1.2.3', '2.3.4'])).toBe(false)

    expect(isVersionMatch('0.9.0', ['1.0.0', '2.0.0'])).toBe(false)
    expect(isVersionMatch('3.0.0', ['1.0.0', '2.0.0'])).toBe(true)

    expect(isVersionMatch('1.2.2', ['0.1.2', '1.2.3', '2.3.4'])).toBe(false)
    expect(isVersionMatch('1.2.3', ['0.1.2', '1.2.3', '2.3.4'])).toBe(true)
    expect(isVersionMatch('1.2.4', ['0.1.2', '1.2.3', '2.3.4'])).toBe(true)
    expect(isVersionMatch('1.2.4', ['0.1.2', '2.3.4'])).toBe(false)
  })

  it('pre-release versions', () => {
    expect(isVersionMatch('1.0.0-alpha', ['1.0.0'])).toBe(true)
    expect(isVersionMatch('1.0.0-alpha', ['1.0.1'])).toBe(false)
  })

  it('edge cases', () => {
    // Extra version parts (Git-style)
    expect(isVersionMatch('1.0.0.1', ['1.0.0'])).toBe(true)

    // Malformed versions
    expect(() => isVersionMatch('1.0', ['1.0.0'])).toThrow()
  })
})
