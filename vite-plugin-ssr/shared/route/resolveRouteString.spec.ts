import { resolveRouteString } from './resolveRouteString'
import { expect, describe, it } from 'vitest'
import partRegex from '@brillout/part-regex'

describe('resolveRouteString', () => {
  it('basics', () => {
    expect(resolveRouteString('/a', '/b')).toEqual(null)
    expect(resolveRouteString('/a', '/a')).toEqual({ routeParams: {} })
    expect(resolveRouteString('/', '/')).toEqual({ routeParams: {} })

    expectError(
      () => resolveRouteString('', '/a/b/c'),
      partRegex`[vite-plugin-ssr@${/[\.0-9]+/}][Wrong Usage] Invalid route string \`\` (empty string): route strings should start with a leading slash \`/\` (or be \`*\`).`,
    )
    expectError(
      () => resolveRouteString('a', '/a/b/c'),
      partRegex`[vite-plugin-ssr@${/[\.0-9]+/}][Wrong Usage] Invalid route string \`a\`: route strings should start with a leading slash \`/\` (or be \`*\`).`,
    )
  })

  it('parameterized routes', () => {
    expect(resolveRouteString('/@p', '/a')).toEqual({ routeParams: { p: 'a' } })
    expect(resolveRouteString('/@p', '/a/')).toEqual({ routeParams: { p: 'a' } })
    expect(resolveRouteString('/@p', '/a/b')).toEqual(null)
    expect(resolveRouteString('/@p', '/')).toEqual(null)
    expect(resolveRouteString('/@p', '/@p')).toEqual({ routeParams: { p: '@p' } })

    expect(resolveRouteString('/a/@p', '/a/b')).toEqual({ routeParams: { p: 'b' } })
    expect(resolveRouteString('/a/@p', '/a/b/')).toEqual({ routeParams: { p: 'b' } })
    expect(resolveRouteString('/a/@p', '/a/b/c/d')).toEqual(null)
    expect(resolveRouteString('/a/@p', '/a/b/c')).toEqual(null)
    expect(resolveRouteString('/a/@p', '/a/')).toEqual(null)
    expect(resolveRouteString('/a/@p', '/a')).toEqual(null)
    expect(resolveRouteString('/a/@p', '/c/b')).toEqual(null)
    expect(resolveRouteString('/a/@p', '/c')).toEqual(null)
    expect(resolveRouteString('/a/@p', '/c/')).toEqual(null)

    expect(resolveRouteString('/a/b/@p', '/a/b/c')).toEqual({ routeParams: { p: 'c' } })
    expect(resolveRouteString('/a/b/@p', '/a/b/')).toEqual(null)
    expect(resolveRouteString('/a/b/@p', '/a/b')).toEqual(null)
    expect(resolveRouteString('/a/b/@p', '/a/c/')).toEqual(null)
    expect(resolveRouteString('/a/b/@p', '/a/c')).toEqual(null)
    expect(resolveRouteString('/a/b/@p', '/a')).toEqual(null)

    expect(resolveRouteString('/@p1/@p2', '/a/b')).toEqual({ routeParams: { p1: 'a', p2: 'b' } })
    expect(resolveRouteString('/@p1/@p2', '/a/b/')).toEqual({ routeParams: { p1: 'a', p2: 'b' } })
    expect(resolveRouteString('/@p1/@p2', '/a/b/c/d')).toEqual(null)
    expect(resolveRouteString('/@p1/@p2', '/a/b/c')).toEqual(null)
  })

  it('glob', () => {
    expect(resolveRouteString('*', '/')).toEqual({ routeParams: { '*': '' } })
    expect(resolveRouteString('/*', '/')).toEqual({ routeParams: { '*': '' } })
    expect(resolveRouteString('/*', '/a')).toEqual({ routeParams: { '*': 'a' } })
    expect(resolveRouteString('*', '/a')).toEqual({ routeParams: { '*': 'a' } })
    expect(resolveRouteString('/*', '/a/b')).toEqual({ routeParams: { '*': 'a/b' } })
    expect(resolveRouteString('*', '/a/b')).toEqual({ routeParams: { '*': 'a/b' } })
    expect(resolveRouteString('/*', '/a/b/c')).toEqual({ routeParams: { '*': 'a/b/c' } })
    expect(resolveRouteString('*', '/a/b/c')).toEqual({ routeParams: { '*': 'a/b/c' } })
    expect(resolveRouteString('/a/*', '/a/b')).toEqual({ routeParams: { '*': 'b' } })
    expect(resolveRouteString('/a/*', '/a/b/c/d')).toEqual({ routeParams: { '*': 'b/c/d' } })
    expect(resolveRouteString('/a/*', '/b/c')).toEqual(null)

    expectError(
      () => resolveRouteString('/a/*/c/*', '/a/b/c'),
      partRegex`[vite-plugin-ssr@${/[\.0-9]+/}][Wrong Usage] Invalid route string \`/a/*/c/*\`: route strings are not allowed to contain more than one glob character \`*\`.`,
    )
    expectError(
      () => resolveRouteString('/a/*/c', '/a/b/c'),
      partRegex`[vite-plugin-ssr@${/[\.0-9]+/}][Wrong Usage] Invalid route string \`/a/*/c\`: make sure your route string ends with the glob character \`*\`.`,
    )
  })

  it('special characters', () => {
    expect(resolveRouteString('/@p', '/\\')).toEqual({ routeParams: { p: '\\' } })
    expect(resolveRouteString('/a/@p', '/a/\\')).toEqual({ routeParams: { p: '\\' } })
    expect(resolveRouteString('/a/@p', '/a/b')).toEqual({ routeParams: { p: 'b' } })
    expect(resolveRouteString('/a/@p', '/a\\b')).toEqual(null)

    expect(resolveRouteString('/@p', '/!(')).toEqual({ routeParams: { p: '!(' } })
    expect(resolveRouteString('/*', '/!(')).toEqual({ routeParams: { '*': '!(' } })
    expect(resolveRouteString('/@p', '/¥')).toEqual({ routeParams: { p: '¥' } })
    expect(resolveRouteString('/*', '/¥')).toEqual({ routeParams: { '*': '¥' } })
  })
})

function expectError(fn: Function, errRegex: RegExp) {
  {
    let err: Error | undefined
    try {
      fn()
    } catch (err_) {
      err = err_
    }
    expect(err?.message).toMatch(errRegex)
  }
}
