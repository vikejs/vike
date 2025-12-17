import { expect, describe, it, assert } from 'vitest'
import { isDistinguishable, isPathAliasRecommended, parseNpmPackage } from './parseNpmPackage.js'

describe('parseNpmPackage()', () => {
  it('yes', () => {
    expect(parseNpmPackage('foo')).toStrictEqual({ pkgName: 'foo', importPath: null })
    expect(parseNpmPackage('some-pkg')).toStrictEqual({ pkgName: 'some-pkg', importPath: null })
    expect(parseNpmPackage('@scope/name')).toStrictEqual({ pkgName: '@scope/name', importPath: null })
    expect(parseNpmPackage('@scope/name/path')).toStrictEqual({ pkgName: '@scope/name', importPath: 'path' })
    expect(parseNpmPackage('@scope/name/some/deep/path.js')).toStrictEqual({
      pkgName: '@scope/name',
      importPath: 'some/deep/path.js',
    })
  })
  it('no', () => {
    expect(parseNpmPackage('somePkg')).toBe(null) // npm packages are not allowed upper case characters in their name
    expect(parseNpmPackage('./some/path')).toBe(null)
    expect(parseNpmPackage('/some-path')).toBe(null)
    expect(parseNpmPackage('\\some/path')).toBe(null)
    expect(parseNpmPackage('.\\some-path')).toBe(null)
    expect(parseNpmPackage('#alias')).toBe(null)
    expect(parseNpmPackage('a!bc')).toBe(null)
  })
  it('thorough tests', () => {
    expect(parseNpmPackage('')).toBe(null)
    expect(parseNpmPackage('a')).toStrictEqual({ pkgName: 'a', importPath: null }) // https://www.npmjs.com/package/a
    expect(parseNpmPackage('0')).toStrictEqual({ pkgName: '0', importPath: null }) // https://www.npmjs.com/package/0
    expect(parseNpmPackage('-')).toBe(null) // actually wrong: https://www.npmjs.com/package/-
    expect(parseNpmPackage('_')).toBe(null) // https://www.npmjs.com/package/_
    expect(parseNpmPackage('a_')).toStrictEqual({ pkgName: 'a_', importPath: null }) // https://www.npmjs.com/package/a_
    expect(parseNpmPackage('some_pkg')).toStrictEqual({ pkgName: 'some_pkg', importPath: null })
    expect(parseNpmPackage('.')).toBe(null)
    expect(parseNpmPackage('.a')).toBe(null)
    expect(parseNpmPackage('a.js')).toStrictEqual({ pkgName: 'a.js', importPath: null }) // https://www.npmjs.com/package/a.js
    expect(parseNpmPackage('a.')).toStrictEqual({ pkgName: 'a.', importPath: null }) // https://www.npmjs.com/package/a.js
    expect(parseNpmPackage('a-')).toStrictEqual({ pkgName: 'a-', importPath: null })
    expect(parseNpmPackage('a_')).toStrictEqual({ pkgName: 'a_', importPath: null })
    expect(parseNpmPackage('@')).toBe(null)
    expect(parseNpmPackage('@/')).toBe(null)
    expect(parseNpmPackage('@/a')).toBe(null)
    expect(parseNpmPackage('@a')).toBe(null)
    expect(parseNpmPackage('@a/')).toBe(null)
    expect(parseNpmPackage('@a/b')).toStrictEqual({ pkgName: '@a/b', importPath: null })
    expect(parseNpmPackage('@a!b/c')).toBe(null)
    expect(parseNpmPackage('@a/b/c!')).toStrictEqual({ pkgName: '@a/b', importPath: 'c!' })
    expect(parseNpmPackage('@layouts/LayoutDefault')).toStrictEqual(null) // npm packages are not allowed upper case characters in their name
    expect(parseNpmPackage('@layouts/layoutdefault')).toStrictEqual({
      importPath: null,
      pkgName: '@layouts/layoutdefault',
    })
  })
})

describe('isPathAliasRecommended()', () => {
  it('basics', () => {
    // Un-distinguishable from npm package names
    expect(isPathAliasRecommended('a')).toBe(false)
    expect(isPathAliasRecommended('a/b')).toBe(false)
    expect(isPathAliasRecommended('a/b/c')).toBe(false)
    expect(isPathAliasRecommended('a/b/c/d')).toBe(false)
    expect(isPathAliasRecommended('@')).toBe(false)
    expect(isPathAliasRecommended('@a')).toBe(false)
    expect(isPathAliasRecommended('@a/b')).toBe(false)
    expect(isPathAliasRecommended('@a/b/c')).toBe(false)
    expect(isPathAliasRecommended('@a/b/c/d')).toBe(false)

    // Edge-case needed by contra.com and https://github.com/vikejs/vike/issues/1567#issuecomment-3076374243
    expect(isPathAliasRecommended('@/a')).toBe(true)

    // Starts with a special character
    expect(isPathAliasRecommended('A')).toBe(false)
    expect(isPathAliasRecommended('a!')).toBe(false)
    // Even though they are distinguishable
    assert(isDistinguishable('A'))
    assert(isDistinguishable('a!'))

    // Valid path aliases
    expect(isPathAliasRecommended('#')).toBe(true)
    expect(isPathAliasRecommended('#a')).toBe(true)
    expect(isPathAliasRecommended('!')).toBe(true)
    expect(isPathAliasRecommended('!a')).toBe(true)
    expect(isPathAliasRecommended('/')).toBe(true)
    expect(isPathAliasRecommended('/a')).toBe(true)
    expect(isPathAliasRecommended('$a/b/c')).toBe(true)
    expect(isPathAliasRecommended('%bla')).toBe(true)
  })
})
