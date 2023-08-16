import { resolveRouteString } from './resolveRouteString.js'
import { resolveRouteStringRedirect } from './resolveRedirects.js'
import { stripAnsi } from '../../utils/stripAnsi.js'
import { expect, describe, it } from 'vitest'

const r: typeof resolveRouteString = (a, b) => resolveRouteString(a, b)

describe('resolveRouteString', () => {
  it('basics', () => {
    expect(r('/a', '/b')).toEqual(null)
    expect(r('/a', '/a')).toEqual({ routeParams: {} })
    expect(r('/', '/')).toEqual({ routeParams: {} })

    expectErr(
      () => r('', '/a/b/c'),
      `[vite-plugin-ssr][Wrong Usage] Invalid Route String '' (empty string): set it to / instead`
    )
    expectErr(
      () => r('a', '/a/b/c'),
      `[vite-plugin-ssr][Wrong Usage] Invalid Route String a: Route Strings should start with a leading slash / (or be *)`
    )
  })

  it('parameterized routes', () => {
    expect(r('/@p', '/a')).toEqual({ routeParams: { p: 'a' } })
    expect(r('/@p', '/a/')).toEqual({ routeParams: { p: 'a' } })
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
    expect(r('*', '/')).toEqual({ routeParams: { '*': '' } })
    expect(r('/*', '/')).toEqual({ routeParams: { '*': '' } })
    expect(r('/*', '/a')).toEqual({ routeParams: { '*': 'a' } })
    expect(r('*', '/a')).toEqual({ routeParams: { '*': 'a' } })
    expect(r('/*', '/a/b')).toEqual({ routeParams: { '*': 'a/b' } })
    expect(r('*', '/a/b')).toEqual({ routeParams: { '*': 'a/b' } })
    expect(r('/*', '/a/b/c')).toEqual({ routeParams: { '*': 'a/b/c' } })
    expect(r('*', '/a/b/c')).toEqual({ routeParams: { '*': 'a/b/c' } })
    expect(r('/a/*', '/a/b')).toEqual({ routeParams: { '*': 'b' } })
    expect(r('/a/*', '/a/b/c/d')).toEqual({ routeParams: { '*': 'b/c/d' } })
    expect(r('/a/*', '/b/c')).toEqual(null)

    expectErr(
      () => r('/a/*/c/*', '/a/b/c'),
      `[vite-plugin-ssr][Wrong Usage] Invalid Route String /a/*/c/*: Route Strings aren't allowed to contain more than one glob *`
    )
    expectErr(
      () => r('/a/*/c', '/a/b/c'),
      `[vite-plugin-ssr][Wrong Usage] Invalid Route String /a/*/c: make sure it ends with *`
    )
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
})

describe('resolveRouteStringRedirect', () => {
  it('basics', () => {
    expect(resolveRouteStringRedirect('/a', '/b', '/a')).toEqual('/b')
    expect(resolveRouteStringRedirect('/a', '/b', '/c')).toEqual(null)
    expect(resolveRouteStringRedirect('/@id', '/b/@id', '/1')).toEqual('/b/1')
    expect(resolveRouteStringRedirect('/@id', '/b', '/1')).toEqual('/b')
    expect(resolveRouteStringRedirect('/@id', '/b', '/b')).toEqual(null)
    expect(resolveRouteStringRedirect('/@a/@b', '/@b/@a', '/1/2')).toEqual('/2/1')
  })
  it('edge cases', () => {
    expect(resolveRouteStringRedirect('/', '/', '/')).toEqual(null)
    expect(resolveRouteStringRedirect('//', '/', '//')).toEqual('/')
    expect(resolveRouteStringRedirect('//', '/', '/')).toEqual(null)
    expect(resolveRouteStringRedirect('/@id', '/b/@id/@id', '/1')).toEqual('/b/1/1')
    expect(resolveRouteStringRedirect('/@a/@b', '/c', '/b')).toEqual(null)
  })
  it('handles invalid redirects', () => {
    expectErr(
      () => resolveRouteStringRedirect('a', 'b', '/'),
      '[vite-plugin-ssr][Wrong Usage][vite.config.js > ssr({ redirects })] Invalid Route String a: Route Strings should start with a leading slash / (or be *)'
    )
    expectErr(
      () => resolveRouteStringRedirect('/a', 'b', '/'),
      '[vite-plugin-ssr][Wrong Usage][vite.config.js > ssr({ redirects })] Invalid Route String b: Route Strings should start with a leading slash / (or be *)'
    )
    expectErr(
      () => resolveRouteStringRedirect('/a', '/@i', '/'),
      '[vite-plugin-ssr][Wrong Usage][vite.config.js > ssr({ redirects })] The redirect source /a is missing the URL parameter @i used by the redirect target /@i'
    )
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
