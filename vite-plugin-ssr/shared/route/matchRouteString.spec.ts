import { matchRouteString } from './matchRouteString'
import { expect, describe, it } from 'vitest'

describe('matchRouteString', () => {
  it('basics', () => {
    expect(matchRouteString('/a', '/b')).toEqual(null)
    expect(matchRouteString('/a', '/a')).toEqual({ routeParams: {} })
    expect(matchRouteString('/', '/')).toEqual({ routeParams: {} })
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
    expect(matchRouteString('/a/*/c', '/a/b/c')).toEqual(null) // TODO
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
