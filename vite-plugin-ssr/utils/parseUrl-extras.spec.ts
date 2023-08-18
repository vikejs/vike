import { normalizeUrlPathname } from './parseUrl-extras.js'

import { expect, describe, it } from 'vitest'
describe('normalizeUrlPathname()', () => {
  it('works', () => {
    expect(normalizeUrlPathname('/bla/')).toBe('/bla')
    expect(normalizeUrlPathname('/bla')).toBe(null)
    expect(normalizeUrlPathname('/bla///')).toBe('/bla')
    expect(normalizeUrlPathname('/bla///foo//')).toBe('/bla/foo')
    expect(normalizeUrlPathname('/')).toBe(null)
    expect(normalizeUrlPathname('//')).toBe('/')
    expect(normalizeUrlPathname('/////')).toBe('/')
    expect(normalizeUrlPathname('https://example.org/p/')).toBe('https://example.org/p')
    expect(normalizeUrlPathname('/p/?foo=bar#bla')).toBe('/p?foo=bar#bla')
    expect(normalizeUrlPathname('////?foo=bar#bla')).toBe('/?foo=bar#bla')
    expect(normalizeUrlPathname('https://example.org/some-url/?foo=bar#bla')).toBe(
      'https://example.org/some-url?foo=bar#bla'
    )
  })
})
