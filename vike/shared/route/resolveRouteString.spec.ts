import { resolveRouteString } from './resolveRouteString.js'
import { stripAnsi } from '../../utils/stripAnsi.js'
import { expect, describe, it, assert } from 'vitest'

const r: typeof resolveRouteString = (a, b) => resolveRouteString(a, b)

describe('resolveRouteString', () => {
  /*
  it('tmp', () => {
    expect(r('/@p', '/a')).toEqual({ routeParams: { p: 'a' } })
    expect(r('/@p/b', '/a/b')).toEqual({ routeParams: { p: 'a' } })
    expect(r('/@p1/@p2', '/a/b')).toEqual({ routeParams: { p1: 'a', p2: 'b' } })
  })
  return
  //*/

  it('basics', () => {
    expect(r('/a', '/b')).toEqual(null)
    expect(r('/a', '/a')).toEqual({ routeParams: {} })
    expect(r('/', '/')).toEqual({ routeParams: {} })
  })

  it('parameterized routes', () => {
    expect(r('/@p', '/a')).toEqual({ routeParams: { p: 'a' } })
    expect(r('/@p', '/a/')).toEqual({ routeParams: { p: 'a' } })
    expect(r('/@p/b', '/a/b')).toEqual({ routeParams: { p: 'a' } })
    expect(r('/c/@p/b', '/c/a/b')).toEqual({ routeParams: { p: 'a' } })

    expect(r('/@p', '/a/b')).toEqual(null)
    expect(r('/@p', '/')).toEqual(null)
    expect(r('/@p', '/@p')).toEqual({ routeParams: { p: '@p' } })

    expect(r('/a/@p', '/a/b')).toEqual({ routeParams: { p: 'b' } })
    expect(r('/a/@p', '/a/b/')).toEqual({ routeParams: { p: 'b' } })
    expect(r('/a/@p', '/a/b/c/d')).toEqual(null)
    expect(r('/a/@p', '/a/b/c')).toEqual(null)
    expect(r('/a/@p', '/a/')).toEqual(null)
    expect(r('/a/@p', '/a')).toEqual(null)
    expect(r('/a/@p', '/c/b')).toEqual(null)
    expect(r('/a/@p', '/c')).toEqual(null)
    expect(r('/a/@p', '/c/')).toEqual(null)

    expect(r('/a/b/@p', '/a/b/c')).toEqual({ routeParams: { p: 'c' } })
    expect(r('/a/b/@p', '/a/b/')).toEqual(null)
    expect(r('/a/b/@p', '/a/b')).toEqual(null)
    expect(r('/a/b/@p', '/a/c/')).toEqual(null)
    expect(r('/a/b/@p', '/a/c')).toEqual(null)
    expect(r('/a/b/@p', '/a')).toEqual(null)

    expect(r('/@p1/@p2', '/a/b')).toEqual({ routeParams: { p1: 'a', p2: 'b' } })
    expect(r('/@p1/@p2', '/a/b/')).toEqual({ routeParams: { p1: 'a', p2: 'b' } })
    expect(r('/@p1/@p2', '/a/b/c/d')).toEqual(null)
    expect(r('/@p1/@p2', '/a/b/c')).toEqual(null)
  })

  it('glob', () => {
    expect(r('*', '/')).toEqual({ routeParams: { '*': '/' } })
    expect(r('/*', '/')).toEqual({ routeParams: { '*': '' } })
    expect(r('/*', '/a')).toEqual({ routeParams: { '*': 'a' } })
    expect(r('*', '/a')).toEqual({ routeParams: { '*': '/a' } })
    expect(r('/*', '/a/b')).toEqual({ routeParams: { '*': 'a/b' } })
    expect(r('*', '/a/b')).toEqual({ routeParams: { '*': '/a/b' } })
    expect(r('/*', '/a/b/c')).toEqual({ routeParams: { '*': 'a/b/c' } })
    expect(r('*', '/a/b/c')).toEqual({ routeParams: { '*': '/a/b/c' } })
    expect(r('/a/*', '/a/b')).toEqual({ routeParams: { '*': 'b' } })
    expect(r('/a/*', '/a/b/c/d')).toEqual({ routeParams: { '*': 'b/c/d' } })
    expect(r('/a/*', '/b/c')).toEqual(null)
  })

  it('special characters', () => {
    expect(r('/@p', '/\\')).toEqual({ routeParams: { p: '\\' } })
    expect(r('/a/@p', '/a/\\')).toEqual({ routeParams: { p: '\\' } })
    expect(r('/a/@p', '/a/b')).toEqual({ routeParams: { p: 'b' } })
    expect(r('/a/@p', '/a\\b')).toEqual(null)

    expect(r('/@p', '/!(')).toEqual({ routeParams: { p: '!(' } })
    expect(r('/*', '/!(')).toEqual({ routeParams: { '*': '!(' } })
    expect(r('/@p', '/¥')).toEqual({ routeParams: { p: '¥' } })
    expect(r('/*', '/¥')).toEqual({ routeParams: { '*': '¥' } })
  })

  return
  it('invalid route string', () => {
    expectErr(() => r('', '/a/b/c'), `[vike][Wrong Usage] Invalid Route String '' (empty string): set it to / instead`)
    expectErr(
      () => r('a', '/a/b/c'),
      `[vike][Wrong Usage] Invalid Route String a: Route Strings should start with a leading slash / (or be *)`
    )
    expectErr(
      () => r('/a/*/c/*', '/a/b/c'),
      `[vike][Wrong Usage] Invalid Route String /a/*/c/*: Route Strings aren't allowed to contain more than one glob * (use a Route Function instead)`
    )
    expectErr(
      () => r('/a/*/c', '/a/b/c'),
      `[vike][Wrong Usage] Invalid Route String /a/*/c: make sure it ends with * or use a Route Function`
    )
  })
})

//if (false)
describe('resolveRouteString - advanced globbing', () => {
  it('basics', () => {
    expect(test('/a', '/a')).toEqual([])
    expect(test('/', '/')).toEqual([])
    expect(test('/a', '/b')).toBe(false)
    expect(test('/a/b', '/a/b')).toEqual([])
  })
  it('globbing', () => {
    expect(test('/a/*/c', '/a/b/c')).toEqual(['b'])
    expect(test('/a/*/c', '/a/b/d')).toEqual(false)
    expect(test('/a/*', '/a/b/c')).toEqual(['b/c'])
    expect(test('/*', '/a')).toEqual(['a'])
    expect(test('/*', '/a/b/c/d')).toEqual(['a/b/c/d'])
    expect(test('/a/*', '/a/b/c/d')).toEqual(['b/c/d'])
    expect(test('/a/b/*', '/a/b/c/d')).toEqual(['c/d'])
    expect(test('/a/b/c/d', '/a/b/c/d')).toEqual([])
    expect(test('/a/*/c/*/e', '/a/b/c/d/e')).toEqual(['b', 'd'])
    expect(test('/a/*/c/*', '/a/b/c/d/e')).toEqual(['b', 'd/e'])
    expect(test('/a/*/e', '/a/b/c/d/e')).toEqual(['b/c/d'])
  })
  it('globbing - inside segment', () => {
    expect(test('/a*e', '/a/b/c/d/e')).toEqual(['/b/c/d/'])
  })
  it('BurdaForward', () => {
    // Use case 1
    expect(test('/some/*.html', '/some/a.html')).toEqual(['a'])
    expect(test('/some/*.html', '/some/a/b/c.html')).toEqual(['a/b/c'])
    expect(test('/some/*.html', '/some/a/b/c.html')).toEqual(['a/b/c'])
    // Use case 2
    expect(test('/some/route*.html', '/some/route.html')).toEqual([''])
    expect(test('/some/route*.html', '/some/route-a.html')).toEqual(['-a'])
    expect(test('/some/route*.html', '/some/routea/b/c.html')).toEqual(['a/b/c'])
  })
})

function test(routeString: string, urlPathname: string): false | string[] {
  const res = resolveRouteString(routeString, urlPathname)
  if (!res) return false
  const globs: string[] = []
  Object.entries(res.routeParams).forEach(([key, val]) => {
    assert(key.startsWith('*'))
    key = key.slice(1)
    const i = key === '' ? 0 : parseInt(key, 10) - 1
    globs[i] = val
  })
  return globs
}

function expectErr(fn: Function, errMsg: string) {
  {
    let err: Error | undefined
    try {
      fn()
    } catch (err_) {
      err = err_ as Error
    }
    expect(err).toBeTruthy()
    expect(stripAnsi(err!.message)).toBe(errMsg)
  }
}
