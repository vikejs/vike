import { expect, describe, it } from 'vitest'
import { assertVersion, isVersionOrAbove } from './assertVersion.js'

describe('isVersionOrAbove()', () => {
  describe('basic version comparison', () => {
    it('returns true for exact version match', () => {
      expect(isVersionOrAbove('1.0.0', ['1.0.0'])).toBe(true)
      expect(isVersionOrAbove('2.5.3', ['2.5.3'])).toBe(true)
      expect(isVersionOrAbove('10.15.20', ['10.15.20'])).toBe(true)
    })

    it('returns true for higher major version', () => {
      expect(isVersionOrAbove('2.0.0', ['1.0.0'])).toBe(true)
      expect(isVersionOrAbove('5.0.0', ['3.2.1'])).toBe(true)
      expect(isVersionOrAbove('10.0.0', ['9.99.99'])).toBe(true)
    })

    it('returns true for higher minor version', () => {
      expect(isVersionOrAbove('1.1.0', ['1.0.0'])).toBe(true)
      expect(isVersionOrAbove('2.5.0', ['2.3.0'])).toBe(true)
      expect(isVersionOrAbove('1.10.0', ['1.9.0'])).toBe(true)
    })

    it('returns true for higher patch version', () => {
      expect(isVersionOrAbove('1.0.1', ['1.0.0'])).toBe(true)
      expect(isVersionOrAbove('2.3.5', ['2.3.4'])).toBe(true)
      expect(isVersionOrAbove('1.0.10', ['1.0.9'])).toBe(true)
    })

    it('returns false for lower major version', () => {
      expect(isVersionOrAbove('1.0.0', ['2.0.0'])).toBe(false)
      expect(isVersionOrAbove('3.5.2', ['4.0.0'])).toBe(false)
      expect(isVersionOrAbove('9.99.99', ['10.0.0'])).toBe(false)
    })

    it('returns false for lower minor version', () => {
      expect(isVersionOrAbove('1.0.0', ['1.1.0'])).toBe(false)
      expect(isVersionOrAbove('2.3.0', ['2.5.0'])).toBe(false)
      expect(isVersionOrAbove('1.9.0', ['1.10.0'])).toBe(false)
    })

    it('returns false for lower patch version', () => {
      expect(isVersionOrAbove('1.0.0', ['1.0.1'])).toBe(false)
      expect(isVersionOrAbove('2.3.4', ['2.3.5'])).toBe(false)
      expect(isVersionOrAbove('1.0.9', ['1.0.10'])).toBe(false)
    })
  })

  describe('multiple expected versions', () => {
    it('returns true if version meets any of the expected versions', () => {
      expect(isVersionOrAbove('2.0.0', ['1.0.0', '2.0.0', '3.0.0'])).toBe(true)
      expect(isVersionOrAbove('2.5.0', ['1.0.0', '2.0.0', '3.0.0'])).toBe(true)
      expect(isVersionOrAbove('3.5.0', ['1.0.0', '2.0.0', '3.0.0'])).toBe(true)
    })

    it('returns false if version is below all expected versions', () => {
      expect(isVersionOrAbove('0.9.0', ['1.0.0', '2.0.0', '3.0.0'])).toBe(false)
      expect(isVersionOrAbove('1.9.0', ['2.0.0', '3.0.0', '4.0.0'])).toBe(false)
    })

    it('returns null for incompatible major version', () => {
      expect(isVersionOrAbove('5.0.0', ['1.0.0', '2.0.0', '3.0.0'])).toBe(null)
      expect(isVersionOrAbove('10.0.0', ['2.0.0', '3.0.0', '4.0.0'])).toBe(null)
    })
  })

  describe('pre-release versions', () => {
    it('handles pre-release tags correctly', () => {
      expect(isVersionOrAbove('1.0.0-alpha', ['1.0.0'])).toBe(true)
      expect(isVersionOrAbove('1.0.0-beta.1', ['1.0.0'])).toBe(true)
      expect(isVersionOrAbove('2.1.0-rc.1', ['2.0.0'])).toBe(true)
      expect(isVersionOrAbove('1.0.0-alpha', ['1.0.1'])).toBe(false)
    })

    it('compares pre-release versions by base version only', () => {
      expect(isVersionOrAbove('1.0.0-alpha', ['1.0.0-beta'])).toBe(true)
      expect(isVersionOrAbove('1.0.0-rc.1', ['1.0.0-alpha.1'])).toBe(true)
    })
  })

  describe('version parsing edge cases', () => {
    it('handles versions with extra parts (like Git)', () => {
      expect(isVersionOrAbove('1.0.0.1', ['1.0.0'])).toBe(true)
      expect(isVersionOrAbove('2.5.3.20231201', ['2.5.0'])).toBe(true)
      expect(isVersionOrAbove('1.0.0.1', ['1.0.1'])).toBe(false)
    })

    it('handles large version numbers', () => {
      expect(isVersionOrAbove('999.999.999', ['1.0.0'])).toBe(true)
      expect(isVersionOrAbove('1.0.0', ['999.999.999'])).toBe(false)
    })
  })
})

describe('assertVersion()', () => {
  it('does not throw for supported versions', () => {
    expect(() => assertVersion('Node.js', '18.0.0', ['16.0.0'])).not.toThrow()
    expect(() => assertVersion('Vite', '4.0.0', ['3.0.0', '4.0.0'])).not.toThrow()
    expect(() => assertVersion('Node.js', '20.5.1', ['18.0.0', '20.0.0'])).not.toThrow()
  })

  it('throws for unsupported versions', () => {
    expect(() => assertVersion('Node.js', '14.0.0', ['16.0.0'])).toThrow()
    expect(() => assertVersion('Vite', '2.0.0', ['3.0.0', '4.0.0'])).toThrow()
  })

  it('throws with correct error message format for Node.js', () => {
    expect(() => assertVersion('Node.js', '14.0.0', ['16.0.0'])).toThrow(
      /Node\.js.*14\.0\.0.*isn't supported.*use.*Node\.js.*16\.0\.0.*or.*above/,
    )
  })

  it('throws with correct error message format for Vite', () => {
    expect(() => assertVersion('Vite', '2.0.0', ['3.0.0'])).toThrow(
      /Vite.*2\.0\.0.*isn't supported.*use.*Vite.*3\.0\.0.*or.*above/,
    )
  })

  it('handles multiple expected versions in error message', () => {
    expect(() => assertVersion('Node.js', '14.0.0', ['16.0.0', '18.0.0'])).toThrow(
      /Node\.js.*14\.0\.0.*isn't supported.*use.*Node\.js.*16\.0\.0.*or.*18\.0\.0.*or.*above/,
    )
  })

  it('handles pre-release versions in assertions', () => {
    expect(() => assertVersion('Node.js', '18.0.0-pre', ['16.0.0'])).not.toThrow()
    expect(() => assertVersion('Vite', '3.0.0-beta.1', ['4.0.0'])).toThrow()
  })
})

describe('edge cases and error conditions', () => {
  it('handles empty version strings gracefully', () => {
    // These should trigger internal assertions in parseVersion
    expect(() => isVersionOrAbove('', ['1.0.0'])).toThrow()
    expect(() => isVersionOrAbove('1.0.0', [''])).toThrow()
  })

  it('handles malformed version strings', () => {
    expect(() => isVersionOrAbove('1.0', ['1.0.0'])).toThrow()
    expect(() => isVersionOrAbove('1', ['1.0.0'])).toThrow()
    expect(() => isVersionOrAbove('1.0.0.0.0', ['1.0.0'])).not.toThrow() // Should work (extra parts ignored)
  })

  it('handles non-numeric version parts', () => {
    expect(() => isVersionOrAbove('1.a.0', ['1.0.0'])).toThrow()
    expect(() => isVersionOrAbove('a.0.0', ['1.0.0'])).toThrow()
  })

  it('requires non-empty expected versions array', () => {
    expect(() => isVersionOrAbove('1.0.0', [])).toThrow()
  })
})
