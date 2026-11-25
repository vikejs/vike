import { modifyUrlPathname, normalizeUrlPathname, removeUrlOrigin, setUrlOrigin } from './parseUrl-extras.js'
import { expect, describe, it } from 'vitest'

describe('normalizeUrlPathname()', () => {
  it('works', () => {
    expect(n('/bla/')).toBe('/bla')
    expect(n('/bla')).toBe(null)
    expect(n('/bla///')).toBe('/bla')
    expect(n('/bla///foo//')).toBe('/bla/foo')
    expect(n('/')).toBe(null)
    expect(n('//')).toBe('/')
    expect(n('/////')).toBe('/')
    expect(n('https://example.org/p/')).toBe('https://example.org/p')
    expect(n('/p/?foo=bar#bla')).toBe('/p?foo=bar#bla')
    expect(n('////?foo=bar#bla')).toBe('/?foo=bar#bla')
    expect(n('https://example.org/some-url/?foo=bar#bla')).toBe('https://example.org/some-url?foo=bar#bla')
  })
  it('Base URL with trailing slash', () => {
    // Adding a trailing slash is needed because of Vite, see comment in source code of normalizeUrlPathname()
    expect(normalizeUrlPathname('/foo', false, '/foo/')).toBe('/foo/')
    expect(normalizeUrlPathname('/foo', true, '/foo/')).toBe('/foo/')
    expect(normalizeUrlPathname('/foo/', false, '/foo/')).toBe(null)
    expect(normalizeUrlPathname('/foo/', true, '/foo/')).toBe(null)
    // It's fine if URL has trailing slash but not the Base URL
    expect(normalizeUrlPathname('/foo/', true, '/foo')).toBe(null)
    // Works as usual
    expect(normalizeUrlPathname('/foo/', false, '/foo')).toBe('/foo')
  })
  it('file URL with trailingSlash', () => {
    expect(normalizeUrlPathname('/feed.atom', true, '/')).toBe(null)
    expect(normalizeUrlPathname('/feed.atom/', true, '/')).toBe('/feed.atom')
    // Not a known file extension
    expect(normalizeUrlPathname('/v1.2', true, '/')).toBe('/v1.2/')
  })
  function n(urlOriginal: string) {
    return normalizeUrlPathname(urlOriginal, false, '/')
  }
})

describe('modifyUrlPathname()', () => {
  it('merges search and hash', () => {
    // https://github.com/vikejs/vike/issues/3765
    expect(m('/promo?fbclid=1', '/shop?utm_source=promo')).toBe('/shop?utm_source=promo&fbclid=1')
    expect(m('/docs?a=1', '/guide#install')).toBe('/guide?a=1#install')
    expect(m('/docs?a=1#old', '/guide?b=2#install')).toBe('/guide?b=2&a=1#install')
    expect(m('https://a.org/b?c=1', '/d?e=2')).toBe('https://a.org/d?e=2&c=1')
  })
  it('preserves search and hash as-is', () => {
    expect(m('/a?with&some-args#hash', '/b')).toBe('/b?with&some-args#hash')
    expect(m('/a', '/b?with&some-args#hash')).toBe('/b?with&some-args#hash')
  })
  it('path without pathname', () => {
    // E.g. removeUrlOrigin('https://app.nmrium.org#?toc=samples.json').urlModified
    expect(m('/a?b=1', '#?toc=samples.json')).toBe('?b=1#?toc=samples.json')
    expect(m('/a?b=1', '?c=2')).toBe('?c=2&b=1')
  })
  function m(url: string, pathModified: string) {
    return modifyUrlPathname(url, () => pathModified)
  }
})

describe('removeUrlOrigin() / setUrlOrigin()', () => {
  it('works', () => {
    expect(removeUrlOrigin('https://a.com/b')).toEqual({ urlModified: '/b', origin: 'https://a.com' })
    expect(setUrlOrigin('/b', 'https://a.com')).toBe('https://a.com/b')
    ;[
      'https://a.com/b',
      '/a',
      'http://a.b/c/d?a=b#c',
      '/a/b/?c=d#e',
      'http://a.b.c//d/e',
      '//a/c/cwabehiwqehqwueh',
    ].forEach((url) => {
      const { urlModified, origin } = removeUrlOrigin(url)
      expect(urlModified[0]).toBe('/')
      if (urlModified === url) {
        expect(url[0]).toBe('/')
      } else {
        expect(setUrlOrigin(urlModified, origin)).toEqual(url)
      }
    })
  })
})
