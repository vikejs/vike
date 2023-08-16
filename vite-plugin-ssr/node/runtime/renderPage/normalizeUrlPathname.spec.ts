import { normalizeUrlPathname } from './normalizeUrlPathname.js'

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
    expect(normalizeUrlPathname('https://example.org/p/')).toBe('/p')
    expect(normalizeUrlPathname('/p/?foo=bar#bla')).toBe('/p?foo=bar#bla')
    expect(normalizeUrlPathname('////?foo=bar#bla')).toBe('/?foo=bar#bla')
    expect(normalizeUrlPathname('https://example.org/some-url/?foo=bar#bla')).toBe('/some-url?foo=bar#bla')
  })
})
