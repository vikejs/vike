import { resolveRouteString } from './resolveRouteString.js'
import { stripAnsi } from '../../utils/stripAnsi.js'
import { expect, describe, it } from 'vitest'

const r: typeof resolveRouteString = (a, b) => resolveRouteString(a, b)

describe('resolveRouteString', () => {
  /*
  it('tmp', () => {
    expect(r('/a/*', '/a')).toEqual(null)
  })
  return
  //*/

  it('basics', () => {
    expect(r('/a', '/a')).toEqual({ routeParams: {} })
    expect(r('/', '/')).toEqual({ routeParams: {} })
    expect(r('/a/b', '/a/b')).toEqual({ routeParams: {} })
    expect(r('/a/b/c/d', '/a/b/c/d')).toEqual({ routeParams: {} })
    expect(r('/a', '/b')).toEqual(null)
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

  it('glob - trailing', () => {
    expect(r('*', '/')).toEqual({ routeParams: { '*': '/' } })
    expect(r('/*', '/')).toEqual({ routeParams: { '*': '' } })
    expect(r('/a*', '/b')).toEqual(null)
    expect(r('/a*', '/a')).toEqual({ routeParams: { '*': '' } })
    expect(r('/a/*', '/a')).toEqual(null)
    expect(r('/a/*', '/a/b')).toEqual({ routeParams: { '*': 'b' } })
    expect(r('/a/*', '/a/b/c/d')).toEqual({ routeParams: { '*': 'b/c/d' } })
    expect(r('/a/b/*', '/a/b/c/d')).toEqual({ routeParams: { '*': 'c/d' } })
    expect(r('/a/*', '/b/c')).toEqual(null)
  })
  // routeParams['*'] is exactly the substring that `*` matches
  it("glob - trailing - precise routeParams['*']", () => {
    expect(r('*', '/')).toEqual({ routeParams: { '*': '/' } })
    expect(r('/*', '/')).toEqual({ routeParams: { '*': '' } })
    expect(r('/*', '/a')).toEqual({ routeParams: { '*': 'a' } })
    expect(r('*', '/a')).toEqual({ routeParams: { '*': '/a' } })
    expect(r('/*', '/a/b')).toEqual({ routeParams: { '*': 'a/b' } })
    expect(r('*', '/a/b')).toEqual({ routeParams: { '*': '/a/b' } })
    expect(r('*', '/a/b/')).toEqual({ routeParams: { '*': '/a/b/' } })
    expect(r('/*', '/a/b/c')).toEqual({ routeParams: { '*': 'a/b/c' } })
    expect(r('*', '/a/b/c')).toEqual({ routeParams: { '*': '/a/b/c' } })
  })
  it('glob - middle', () => {
    expect(r('/a/*/c', '/a/b/c')).toEqual({ routeParams: { '*': 'b' } })
    expect(r('/a/*/c', '/a/b/d')).toEqual(null)
    expect(r('/a/*/e', '/a/b/c/d/e')).toEqual({ routeParams: { '*': 'b/c/d' } })
    expect(r('/a*e', '/a/b/c/d/e')).toEqual({ routeParams: { '*': '/b/c/d/' } })
  })
  it('glob - multiple', () => {
    expect(r('/a/*/c/*/e', '/a/b/c/d/e')).toEqual({ routeParams: { '*1': 'b', '*2': 'd' } })
    expect(r('/a/*/c/*', '/a/b/c/d/e')).toEqual({ routeParams: { '*1': 'b', '*2': 'd/e' } })
    expect(r('/a/*/c/*', '/a/b/c/d/e/')).toEqual({ routeParams: { '*1': 'b', '*2': 'd/e/' } })
    expect(r('*a*', '/a/b/c/d/e')).toEqual({ routeParams: { '*1': '/', '*2': '/b/c/d/e' } })
    expect(r('*a*e', '/a/b/c/d/e')).toEqual({ routeParams: { '*1': '/', '*2': '/b/c/d/' } })
    expect(r('*a*c', '/a/b/c/d/e')).toEqual(null)
    expect(r('*a*c*', '/a/b/c/d/e')).toEqual({ routeParams: { '*1': '/', '*2': '/b/', '*3': '/d/e' } })
  })
  it('glob - edge cases', () => {
    expect(r('/a*b*c', '/abc')).toEqual({ routeParams: { '*1': '', '*2': '' } })
    expect(r('/a*b*c*', '/abc')).toEqual({ routeParams: { '*1': '', '*2': '', '*3': '' } })
    expect(r('*/a*b*c*', '/abc')).toEqual({ routeParams: { '*1': '', '*2': '', '*3': '', '*4': '' } })
  })
  // A linear matching implementation fails with the following
  it('glob - complex non-linear matching', () => {
    // Only works if linear matching is greedy:
    expect(r('*a', '/aaaa')).toEqual({ routeParams: { '*': '/aaa' } })
    expect(r('/a*a', '/aaaa')).toEqual({ routeParams: { '*': 'aa' } })
    // A linear matching implementation cannot handle this:
    expect(r('/a*a*b*', '/aaaaaba')).toEqual({ routeParams: { '*1': 'aaa', '*2': '', '*3': 'a' } })
    expect(r('/a*b*0*', '/aabcbc0')).toEqual({ routeParams: { '*1': 'abc', '*2': 'c', '*3': '' } })
    expect(r('/a*b*0*', '/aab0cbc')).toEqual({ routeParams: { '*1': 'a', '*2': '', '*3': 'cbc' } })
  })
  it('glob - BurdaForward', () => {
    // Use case 1
    expect(r('/some/*.html', '/some/a.html')).toEqual({ routeParams: { '*': 'a' } })
    expect(r('/some/*.html', '/some/a/b/c.html')).toEqual({ routeParams: { '*': 'a/b/c' } })
    // Use case 2
    expect(r('/some/route*.html', '/some/route.html')).toEqual({ routeParams: { '*': '' } })
    expect(r('/some/route*.html', '/some/route-a.html')).toEqual({ routeParams: { '*': '-a' } })
    expect(r('/some/route*.html', '/some/routea/b/c.html')).toEqual({ routeParams: { '*': 'a/b/c' } })
  })

  it('URL with trailing slash', () => {
    expect(r('/@p', '/a/')).toEqual({ routeParams: { p: 'a' } })
    expect(r('/a/*', '/a')).toEqual(null)
    expect(r('/a*', '/a')).toEqual({ routeParams: { '*': '' } })
    expect(r('/news/press-releases/*', '/news/press-releases')).toEqual(null)
    expect(r('/news/press-releases*', '/news/press-releases')).toEqual({ routeParams: { '*': '' } })
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

  it('invalid route string', () => {
    expectErr(() => r('', '/a/b/c'), `[vike][Wrong Usage] Invalid Route String '' (empty string): set it to / instead`)
    expectErr(() => r('a', '/a/b/c'), `[vike][Wrong Usage] Invalid Route String a: it should start with / or *`)
    expectErr(() => r('/a**b', '/a/b/c'), `[vike][Wrong Usage] Invalid Route String /a**b: set it to /a*b instead`)
  })
})

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
