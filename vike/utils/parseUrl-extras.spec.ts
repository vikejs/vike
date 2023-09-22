import { normalizeUrlPathname, removeUrlOrigin, addUrlOrigin } from './parseUrl-extras.js'
import { expect, describe, it } from 'vitest'

describe('normalizeUrlPathname()', () => {
  it('works', () => {
    expect(normalizeUrlPathname('/bla/', false)).toBe('/bla')
    expect(normalizeUrlPathname('/bla', false)).toBe(null)
    expect(normalizeUrlPathname('/bla///', false)).toBe('/bla')
    expect(normalizeUrlPathname('/bla///foo//', false)).toBe('/bla/foo')
    expect(normalizeUrlPathname('/', false)).toBe(null)
    expect(normalizeUrlPathname('//', false)).toBe('/')
    expect(normalizeUrlPathname('/////', false)).toBe('/')
    expect(normalizeUrlPathname('https://example.org/p/', false)).toBe('https://example.org/p')
    expect(normalizeUrlPathname('/p/?foo=bar#bla', false)).toBe('/p?foo=bar#bla')
    expect(normalizeUrlPathname('////?foo=bar#bla', false)).toBe('/?foo=bar#bla')
    expect(normalizeUrlPathname('https://example.org/some-url/?foo=bar#bla', false)).toBe(
      'https://example.org/some-url?foo=bar#bla'
    )
  })
})

describe('removeUrlOrigin() / addUrlOrigin()', () => {
  it('works', () => {
    expect(removeUrlOrigin('https://a.com/b')).toEqual({ urlModified: '/b', origin: 'https://a.com' })
    expect(addUrlOrigin('/b', 'https://a.com')).toBe('https://a.com/b')
    ;[
      'https://a.com/b',
      '/a',
      'http://a.b/c/d?a=b#c',
      '/a/b/?c=d#e',
      'http://a.b.c//d/e',
      '//a/c/cwabehiwqehqwueh'
    ].forEach((url) => {
      const { urlModified, origin } = removeUrlOrigin(url)
      expect(urlModified[0]).toBe('/')
      expect(addUrlOrigin(urlModified, origin)).toEqual(url)
    })
  })
})
