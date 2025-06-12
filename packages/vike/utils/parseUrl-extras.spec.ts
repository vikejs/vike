import { normalizeUrlPathname, removeUrlOrigin, setUrlOrigin } from './parseUrl-extras.js'
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
  function n(urlOriginal: string) {
    return normalizeUrlPathname(urlOriginal, false, '/')
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
