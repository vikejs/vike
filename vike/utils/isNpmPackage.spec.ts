import { expect, describe, it, assert } from 'vitest'
import { isDistinguishable, isValidPathAlias, parse } from './isNpmPackage.js'

describe('parse()', () => {
  it('yes', () => {
    expect(parse('some-pkg')).toStrictEqual({ pkgName: 'some-pkg', importPath: null })
    expect(parse('@scope/name')).toStrictEqual({ pkgName: '@scope/name', importPath: null })
    expect(parse('@scope/name/path')).toStrictEqual({ pkgName: '@scope/name', importPath: 'path' })
    expect(parse('@scope/name/some/deep/path.js')).toStrictEqual({
      pkgName: '@scope/name',
      importPath: 'some/deep/path.js'
    })
  })
  it('no', () => {
    expect(parse('somePkg')).toBe(null) // NPM packages are not allowed upper case characters in their name
    expect(parse('./some/path')).toBe(null)
    expect(parse('/some-path')).toBe(null)
    expect(parse('\\some/path')).toBe(null)
    expect(parse('.\\some-path')).toBe(null)
    expect(parse('#alias')).toBe(null)
    expect(parse('a!bc')).toBe(null)
  })
  it('edge cases', () => {
    expect(parse('')).toBe(null)
    expect(parse('a')).toStrictEqual({ pkgName: 'a', importPath: null })
    expect(parse('0')).toStrictEqual({ pkgName: '0', importPath: null }) // https://www.npmjs.com/package/0
    expect(parse('-')).toBe(null) // actually wrong: https://www.npmjs.com/package/-
    expect(parse('_')).toBe(null)
    expect(parse('.')).toBe(null)
    expect(parse('.a')).toBe(null)
    expect(parse('a.js')).toStrictEqual({ pkgName: 'a.js', importPath: null }) // https://www.npmjs.com/package/a.js
    expect(parse('a.')).toStrictEqual({ pkgName: 'a.', importPath: null }) // https://www.npmjs.com/package/a.js
    expect(parse('a-')).toStrictEqual({ pkgName: 'a-', importPath: null })
    expect(parse('a_')).toStrictEqual({ pkgName: 'a_', importPath: null })
    expect(parse('@')).toBe(null)
    expect(parse('@/')).toBe(null)
    expect(parse('@/a')).toBe(null)
    expect(parse('@a')).toBe(null)
    expect(parse('@a/')).toBe(null)
    expect(parse('@a/b')).toStrictEqual({ pkgName: '@a/b', importPath: null })
    expect(parse('@a!b/c')).toBe(null)
    expect(parse('@a/b/c!')).toStrictEqual({ pkgName: '@a/b', importPath: 'c!' })
  })
})

describe('isValidPathAlias()', () => {
  it('basics', () => {
    // Un-distinguishable from npm package names
    expect(isValidPathAlias('a')).toBe(false)
    expect(isValidPathAlias('a/b')).toBe(false)
    expect(isValidPathAlias('a/b/c')).toBe(false)
    expect(isValidPathAlias('a/b/c/d')).toBe(false)
    expect(isValidPathAlias('@')).toBe(false)
    expect(isValidPathAlias('@a')).toBe(false)
    expect(isValidPathAlias('@a/b')).toBe(false)
    expect(isValidPathAlias('@a/b/c')).toBe(false)
    expect(isValidPathAlias('@a/b/c/d')).toBe(false)

    // Edge-case needed by contra.com
    expect(isValidPathAlias('@/a')).toBe(true)

    // Starts with a special character
    expect(isValidPathAlias('A')).toBe(false)
    expect(isValidPathAlias('a!')).toBe(false)
    // Even though they are distinguishable
    assert(isDistinguishable('A'))
    assert(isDistinguishable('a!'))

    // Valid path aliases
    expect(isValidPathAlias('#')).toBe(true)
    expect(isValidPathAlias('#a')).toBe(true)
    expect(isValidPathAlias('!')).toBe(true)
    expect(isValidPathAlias('!a')).toBe(true)
    expect(isValidPathAlias('/')).toBe(true)
    expect(isValidPathAlias('/a')).toBe(true)
    expect(isValidPathAlias('$a/b/c')).toBe(true)
    expect(isValidPathAlias('%bla')).toBe(true)
  })
})
