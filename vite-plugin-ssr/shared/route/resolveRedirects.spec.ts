import { resolveRouteStringRedirect } from './resolveRedirects.js'
import { stripAnsi } from '../../utils/stripAnsi.js'
import { expect, describe, it } from 'vitest'

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
      '[vite-plugin-ssr][Wrong Usage][vite.config.js > ssr({ redirects })] Invalid redirection target URL b: the target URL should start with /, http://, https://, or be *'
    )
    expectErr(
      () => resolveRouteStringRedirect('/a', '/@i', '/'),
      '[vite-plugin-ssr][Wrong Usage][vite.config.js > ssr({ redirects })] The redirect source /a is missing the URL parameter @i used by the redirect target /@i'
    )
    expectErr(
      () => resolveRouteStringRedirect('/a', '/b/*', '/'),
      '[vite-plugin-ssr][Wrong Usage][vite.config.js > ssr({ redirects })] The redirect source /a is missing the URL parameter * used by the redirect target /b/*'
    )
    expectErr(
      () => resolveRouteStringRedirect('/', '/*', '/'),
      '[vite-plugin-ssr][Wrong Usage][vite.config.js > ssr({ redirects })] The redirect source / is missing the URL parameter * used by the redirect target /*'
    )
    expectErr(
      () => resolveRouteStringRedirect('/', '*', '/'),
      '[vite-plugin-ssr][Wrong Usage][vite.config.js > ssr({ redirects })] The redirect source / is missing the URL parameter * used by the redirect target *'
    )
  })
  it('globs', () => {
    expect(resolveRouteStringRedirect('/a/*', '/b/*', '/a/1')).toEqual('/b/1')
    expect(resolveRouteStringRedirect('/a/*', '/b/c/*', '/a/1/2/3')).toEqual('/b/c/1/2/3')
    expect(resolveRouteStringRedirect('/a/*', '/*', '/a/b')).toEqual('/b')
  })
  it('external redirects', () => {
    expect(resolveRouteStringRedirect('/a/*', 'https://a.org/*', '/a/1')).toEqual('https://a.org/1')
    expect(resolveRouteStringRedirect('/a/*', 'http://a.org/b/c/d/*', '/a/1/2/3')).toEqual('http://a.org/b/c/d/1/2/3')
    expect(resolveRouteStringRedirect('/a/b/c', 'http://a.com', '/a/b/c')).toEqual('http://a.com')
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
