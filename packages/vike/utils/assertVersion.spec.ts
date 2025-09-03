import { expect, describe, it } from 'vitest'
import { assertVersion, isVersionOrAbove } from './assertVersion.js'

describe('isVersionOrAbove()', () => {
  describe('basic version comparison', () => {
    it('returns true for exact version match', () => {
      expect(isVersionOrAbove('1.0.0', ['1.0.0'])).toBe(true)
      expect(isVersionOrAbove('2.5.3', ['2.5.3'])).toBe(true)
      expect(isVersionOrAbove('10.15.20', ['10.15.20'])).toBe(true)
    })

    it('returns true for higher minor version (same major)', () => {
      expect(isVersionOrAbove('1.1.0', ['1.0.0'])).toBe(true)
      expect(isVersionOrAbove('2.5.0', ['2.3.0'])).toBe(true)
      expect(isVersionOrAbove('1.10.0', ['1.9.0'])).toBe(true)
    })

    it('returns true for higher patch version (same major.minor)', () => {
      expect(isVersionOrAbove('1.0.1', ['1.0.0'])).toBe(true)
      expect(isVersionOrAbove('2.3.5', ['2.3.4'])).toBe(true)
      expect(isVersionOrAbove('1.0.10', ['1.0.9'])).toBe(true)
    })

    it('returns true for higher major version (incompatible but allowed)', () => {
      expect(isVersionOrAbove('2.0.0', ['1.0.0'])).toBe(true)
      expect(isVersionOrAbove('5.0.0', ['3.2.1'])).toBe(true)
      expect(isVersionOrAbove('10.0.0', ['9.99.99'])).toBe(true)
    })

    it('returns false for lower minor version (same major)', () => {
      expect(isVersionOrAbove('1.0.0', ['1.1.0'])).toBe(false)
      expect(isVersionOrAbove('2.3.0', ['2.5.0'])).toBe(false)
      expect(isVersionOrAbove('1.9.0', ['1.10.0'])).toBe(false)
    })

    it('returns false for lower patch version (same major.minor)', () => {
      expect(isVersionOrAbove('1.0.0', ['1.0.1'])).toBe(false)
      expect(isVersionOrAbove('2.3.4', ['2.3.5'])).toBe(false)
      expect(isVersionOrAbove('1.0.9', ['1.0.10'])).toBe(false)
    })

    it('returns true for lower major version (incompatible but allowed)', () => {
      // When actual major < expected major, compare() returns null, which !== false
      expect(isVersionOrAbove('1.0.0', ['2.0.0'])).toBe(true)
      expect(isVersionOrAbove('3.5.2', ['4.0.0'])).toBe(true)
      expect(isVersionOrAbove('9.99.99', ['10.0.0'])).toBe(true)
    })
  })

  describe('multiple expected versions', () => {
    it('returns true if version is compatible with ALL expected versions', () => {
      // Version 2.0.0: vs 1.0.0 (true), vs 2.0.0 (true), vs 3.0.0 (null) -> all !== false -> true
      expect(isVersionOrAbove('2.0.0', ['1.0.0', '2.0.0', '3.0.0'])).toBe(true)
      // Version 3.5.0 is >= all expected versions
      expect(isVersionOrAbove('3.5.0', ['1.0.0', '2.0.0', '3.0.0'])).toBe(true)
      // Version 4.0.0 has higher major than all expected, so all comparisons return true
      expect(isVersionOrAbove('4.0.0', ['1.0.0', '2.0.0', '3.0.0'])).toBe(true)
    })

    it('returns true if version has lower major than expected (incompatible but allowed)', () => {
      // 0.9.0 vs 1.0.0, 2.0.0, 3.0.0 -> all return null -> all !== false -> true
      expect(isVersionOrAbove('0.9.0', ['1.0.0', '2.0.0', '3.0.0'])).toBe(true)
      expect(isVersionOrAbove('1.9.0', ['2.0.0', '3.0.0', '4.0.0'])).toBe(true)
    })

    it('returns false if version is below any expected version (same major)', () => {
      // 2.5.0 vs 3.0.0 -> null (different major), so this actually returns true
      // Let's test a case that actually returns false
      expect(isVersionOrAbove('1.5.0', ['1.0.0', '1.8.0'])).toBe(false) // fails on 1.8.0 (same major)
      expect(isVersionOrAbove('2.1.0', ['2.0.0', '2.5.0'])).toBe(false) // fails on 2.5.0 (same major)
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
      expect(isVersionOrAbove('999.999.999', ['1.0.0'])).toBe(true) // higher major -> true
      expect(isVersionOrAbove('1.0.0', ['999.999.999'])).toBe(true) // lower major -> null -> true
    })
  })
})

describe('assertVersion()', () => {
  it('does not throw for supported versions', () => {
    expect(() => assertVersion('Node.js', '18.0.0', ['16.0.0'])).not.toThrow()
    expect(() => assertVersion('Vite', '4.0.0', ['3.0.0', '4.0.0'])).not.toThrow()
    expect(() => assertVersion('Node.js', '20.5.1', ['18.0.0', '20.0.0'])).not.toThrow()
  })

  it('does not throw for incompatible major versions (lower or higher)', () => {
    // Lower major versions return null from compare(), which !== false, so no throw
    expect(() => assertVersion('Node.js', '14.0.0', ['16.0.0'])).not.toThrow()
    expect(() => assertVersion('Vite', '2.0.0', ['3.0.0', '4.0.0'])).not.toThrow()
    // Higher major versions return true from compare(), so no throw
    expect(() => assertVersion('Node.js', '20.0.0', ['16.0.0'])).not.toThrow()
  })

  it('throws only for same major version that is too low', () => {
    // Same major version but lower minor/patch should throw
    expect(() => assertVersion('Node.js', '16.5.0', ['16.10.0'])).toThrow()
    expect(() => assertVersion('Vite', '4.1.0', ['4.2.0'])).toThrow()
    expect(() => assertVersion('Node.js', '18.0.0', ['18.0.1'])).toThrow()
  })

  it('throws with correct error message format', () => {
    expect(() => assertVersion('Node.js', '16.5.0', ['16.10.0'])).toThrow(
      /Node\.js.*16\.5\.0.*isn't supported.*use.*Node\.js.*16\.10\.0.*or.*above/,
    )
    expect(() => assertVersion('Vite', '4.1.0', ['4.2.0'])).toThrow(
      /Vite.*4\.1\.0.*isn't supported.*use.*Vite.*4\.2\.0.*or.*above/,
    )
  })

  it('handles multiple expected versions in error message', () => {
    expect(() => assertVersion('Node.js', '16.5.0', ['16.8.0', '16.10.0'])).toThrow(
      /Node\.js.*16\.5\.0.*isn't supported.*use.*16\.8\.0.*16\.10\.0.*or.*above/,
    )
  })

  it('handles pre-release versions in assertions', () => {
    expect(() => assertVersion('Node.js', '18.0.0-pre', ['16.0.0'])).not.toThrow()
    expect(() => assertVersion('Vite', '4.0.0-beta.1', ['4.1.0'])).toThrow() // same major, lower version
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
    // parseInt('a', 10) returns NaN, which may not cause immediate errors but could cause issues
    // Let's test what actually happens
    expect(() => isVersionOrAbove('1.a.0', ['1.0.0'])).not.toThrow() // parseInt('a') = NaN, comparison may work
    expect(() => isVersionOrAbove('a.0.0', ['1.0.0'])).not.toThrow() // parseInt('a') = NaN, comparison may work
  })

  it('requires non-empty expected versions array', () => {
    expect(() => isVersionOrAbove('1.0.0', [])).toThrow()
  })
})

describe('comprehensive integration tests', () => {
  it('works with real-world Node.js version scenarios', () => {
    // Typical Node.js version checking scenarios
    expect(isVersionOrAbove('18.17.0', ['16.0.0', '18.0.0'])).toBe(true)
    expect(isVersionOrAbove('20.5.1', ['18.0.0', '20.0.0'])).toBe(true)
    expect(isVersionOrAbove('16.14.0', ['16.15.0', '18.0.0'])).toBe(false) // same major, but too low
    expect(isVersionOrAbove('14.21.3', ['16.0.0', '18.0.0'])).toBe(true) // lower major, allowed
  })

  it('works with real-world Vite version scenarios', () => {
    // Typical Vite version checking scenarios
    expect(isVersionOrAbove('4.5.0', ['4.0.0', '5.0.0'])).toBe(true) // 4.5.0 vs 5.0.0 -> null (different major) -> true
    expect(isVersionOrAbove('4.5.0', ['4.6.0', '5.0.0'])).toBe(false) // fails on 4.6.0 (same major, lower)
    expect(isVersionOrAbove('5.1.0', ['4.0.0', '5.0.0'])).toBe(true)
    expect(isVersionOrAbove('3.2.7', ['4.0.0', '5.0.0'])).toBe(true) // lower major, allowed
  })

  it('handles complex pre-release scenarios', () => {
    expect(isVersionOrAbove('18.0.0-nightly.20230101', ['18.0.0'])).toBe(true)
    expect(isVersionOrAbove('4.5.0-beta.1', ['4.6.0'])).toBe(false) // same major, lower version
    expect(isVersionOrAbove('5.0.0-rc.1', ['4.0.0'])).toBe(true) // higher major
  })

  it('validates the complete assertVersion workflow', () => {
    // Should not throw for valid scenarios
    expect(() => assertVersion('Node.js', '18.17.0', ['16.0.0', '18.0.0'])).not.toThrow()
    expect(() => assertVersion('Vite', '5.1.0', ['4.0.0', '5.0.0'])).not.toThrow()

    // Should throw for invalid scenarios with proper error messages
    expect(() => assertVersion('Node.js', '16.14.0', ['16.15.0'])).toThrow(/Node\.js.*16\.14\.0.*isn't supported/)
    expect(() => assertVersion('Vite', '4.1.0', ['4.2.0', '5.0.0'])).toThrow(/Vite.*4\.1\.0.*isn't supported/)
  })
})
