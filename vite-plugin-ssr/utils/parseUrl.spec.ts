import { parseUrl } from './parseUrl'
import { expect, describe, it } from 'vitest'

const resultBase = {
  pathnameWithBaseUrl: '/',
  pathnameWithoutBaseUrl: '/',
  hasBaseUrl: true,
  hash: '',
  hashString: null,
  origin: null,
  search: {},
  searchString: null,
}

describe('parseUrl', () => {
  it('basics', () => {
    expect(parseUrl('/', '/')).toEqual(resultBase)
    expect(parseUrl('/hello', '/')).toEqual({
      ...resultBase,
      pathnameWithBaseUrl: '/hello',
      pathnameWithoutBaseUrl: '/hello',
    })
  })

  it('Base URL', () => {
    expect(parseUrl('/base', '/base')).toEqual({
      ...resultBase,
      pathnameWithBaseUrl: '/base',
      pathnameWithoutBaseUrl: '/',
    })
    expect(parseUrl('/base/hello', '/base')).toEqual({
      ...resultBase,
      pathnameWithBaseUrl: '/base/hello',
      pathnameWithoutBaseUrl: '/hello',
    })
    expect(parseUrl('/hello', '/base')).toEqual({
      ...resultBase,
      hasBaseUrl: false,
      pathnameWithBaseUrl: '/hello',
      pathnameWithoutBaseUrl: '/hello',
    })
    expect(parseUrl('/base/hello', '/base/nested')).toEqual({
      ...resultBase,
      hasBaseUrl: false,
      pathnameWithBaseUrl: '/base/hello',
      pathnameWithoutBaseUrl: '/base/hello',
    })
  })

  it('origin', () => {
    expect(parseUrl('https://example.org/', '/')).toEqual({
      ...resultBase,
      origin: 'https://example.org',
    })
    expect(parseUrl('http://example.org/', '/')).toEqual({
      ...resultBase,
      origin: 'http://example.org',
    })
    expect(parseUrl('http://example.org/base/hello', '/base')).toEqual({
      ...resultBase,
      pathnameWithBaseUrl: '/base/hello',
      pathnameWithoutBaseUrl: '/hello',
      origin: 'http://example.org',
    })
  })

  it('hash', () => {
    expect(parseUrl('/#reviews', '/')).toEqual({
      ...resultBase,
      hash: 'reviews',
      hashString: '#reviews',
    })
  })

  it('search', () => {
    expect(parseUrl('/?q=apples', '/')).toEqual({
      ...resultBase,
      search: { q: 'apples' },
      searchString: '?q=apples',
    })
    expect(parseUrl('/shop?fruits=apples&candies=chocolate,lolipop', '/')).toEqual({
      ...resultBase,
      pathnameWithBaseUrl: '/shop',
      pathnameWithoutBaseUrl: '/shop',
      search: { fruits: 'apples', candies: 'chocolate,lolipop' },
      searchString: '?fruits=apples&candies=chocolate,lolipop',
    })
    expect(parseUrl('/shop?fruit=apples&fruit=bannanas&candy=chocolate&candy=lolipop', '/shop')).toEqual({
      ...resultBase,
      pathnameWithBaseUrl: '/shop',
      pathnameWithoutBaseUrl: '/',
      search: { fruit: 'bannanas', candy: 'lolipop' },
      searchString: '?fruit=apples&fruit=bannanas&candy=chocolate&candy=lolipop',
    })
  })
})
