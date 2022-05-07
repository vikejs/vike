import { matchRouteString } from './matchRouteString'
import { expect, describe, it } from 'vitest'
import partRegex from '@brillout/part-regex'

describe('matchRouteString', () => {
  it('basics', () => {
    expect(matchRouteString('/a', '/b')).toEqual(null)
    expect(matchRouteString('/a', '/a')).toEqual({ routeParams: {} })
    expect(matchRouteString('/', '/')).toEqual({ routeParams: {} })

    expectError(
      () => matchRouteString('', '/a/b/c'),
      partRegex`[vite-plugin-ssr@${/[\.0-9]+/}][Wrong Usage] Invalid route string \`\`: route strings should start with a leading slash \`/\`.`,
    )
    expectError(
      () => matchRouteString('a', '/a/b/c'),
      partRegex`[vite-plugin-ssr@${/[\.0-9]+/}][Wrong Usage] Invalid route string \`a\`: route strings should start with a leading slash \`/\`.`,
    )
  })

  it('parameterized routes', () => {
    expect(matchRouteString('/:p', '/a')).toEqual({ routeParams: { p: 'a' } })
    expect(matchRouteString('/:p', '/a/')).toEqual({ routeParams: { p: 'a' } })
    expect(matchRouteString('/:p', '/a/b')).toEqual(null)
    expect(matchRouteString('/:p', '/')).toEqual(null)
    expect(matchRouteString('/:p', '/:p')).toEqual({ routeParams: { p: ':p' } })

    expect(matchRouteString('/a/:p', '/a/b')).toEqual({ routeParams: { p: 'b' } })
    expect(matchRouteString('/a/:p', '/a/b/')).toEqual({ routeParams: { p: 'b' } })
    expect(matchRouteString('/a/:p', '/a/b/c/d')).toEqual(null)
    expect(matchRouteString('/a/:p', '/a/b/c')).toEqual(null)
    expect(matchRouteString('/a/:p', '/a/')).toEqual(null)
    expect(matchRouteString('/a/:p', '/a')).toEqual(null)
    expect(matchRouteString('/a/:p', '/c/b')).toEqual(null)
    expect(matchRouteString('/a/:p', '/c')).toEqual(null)
    expect(matchRouteString('/a/:p', '/c/')).toEqual(null)

    expect(matchRouteString('/a/b/:p', '/a/b/c')).toEqual({ routeParams: { p: 'c' } })
    expect(matchRouteString('/a/b/:p', '/a/b/')).toEqual(null)
    expect(matchRouteString('/a/b/:p', '/a/b')).toEqual(null)
    expect(matchRouteString('/a/b/:p', '/a/c/')).toEqual(null)
    expect(matchRouteString('/a/b/:p', '/a/c')).toEqual(null)
    expect(matchRouteString('/a/b/:p', '/a')).toEqual(null)

    expect(matchRouteString('/:p1/:p2', '/a/b')).toEqual({ routeParams: { p1: 'a', p2: 'b' } })
    expect(matchRouteString('/:p1/:p2', '/a/b/')).toEqual({ routeParams: { p1: 'a', p2: 'b' } })
    expect(matchRouteString('/:p1/:p2', '/a/b/c/d')).toEqual(null)
    expect(matchRouteString('/:p1/:p2', '/a/b/c')).toEqual(null)
  })

  it('glob', () => {
    expect(matchRouteString('*', '/')).toEqual({ routeParams: { '*': '' } })
    expect(matchRouteString('/*', '/')).toEqual({ routeParams: { '*': '' } })
    expect(matchRouteString('/*', '/a')).toEqual({ routeParams: { '*': 'a' } })
    expect(matchRouteString('*', '/a')).toEqual({ routeParams: { '*': 'a' } })
    expect(matchRouteString('/*', '/a/b')).toEqual({ routeParams: { '*': 'a/b' } })
    expect(matchRouteString('*', '/a/b')).toEqual({ routeParams: { '*': 'a/b' } })
    expect(matchRouteString('/*', '/a/b/c')).toEqual({ routeParams: { '*': 'a/b/c' } })
    expect(matchRouteString('*', '/a/b/c')).toEqual({ routeParams: { '*': 'a/b/c' } })
    expect(matchRouteString('/a/*', '/a/b')).toEqual({ routeParams: { '*': 'b' } })
    expect(matchRouteString('/a/*', '/a/b/c/d')).toEqual({ routeParams: { '*': 'b/c/d' } })
    expect(matchRouteString('/a/*', '/b/c')).toEqual(null)

    expectError(
      () => matchRouteString('/a/*/c/*', '/a/b/c'),
      partRegex`[vite-plugin-ssr@${/[\.0-9]+/}][Wrong Usage] Invalid route string \`/a/*/c/*\`: route strings are not allowed to contain more than one glob character \`*\`.`,
    )
    expectError(
      () => matchRouteString('/a/*/c', '/a/b/c'),
      partRegex`[vite-plugin-ssr@${/[\.0-9]+/}][Wrong Usage] Invalid route string \`/a/*/c\`: make sure your route string ends with the glob character \`*\`.`,
    )
  })

  it('special characters', () => {
    expect(matchRouteString('/:p', '/\\')).toEqual({ routeParams: { p: '\\' } })
    expect(matchRouteString('/a/:p', '/a/\\')).toEqual({ routeParams: { p: '\\' } })
    expect(matchRouteString('/a/:p', '/a/b')).toEqual({ routeParams: { p: 'b' } })
    expect(matchRouteString('/a/:p', '/a\\b')).toEqual(null)

    expect(matchRouteString('/:p', '/!(')).toEqual({ routeParams: { p: '!(' } })
    expect(matchRouteString('/*', '/!(')).toEqual({ routeParams: { '*': '!(' } })
    expect(matchRouteString('/:p', '/¥')).toEqual({ routeParams: { p: '¥' } })
    expect(matchRouteString('/*', '/¥')).toEqual({ routeParams: { '*': '¥' } })
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
