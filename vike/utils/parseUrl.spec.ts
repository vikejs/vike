import { parseUrl } from './parseUrl.js'
import { expect, describe, it } from 'vitest'
import assert from 'assert'

describe('parseUrl', () => {
  it('basics', () => {
    expect(parseUrl('/', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/",
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "/",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('/hello', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/hello",
        "origin": null,
        "pathname": "/hello",
        "pathnameOriginal": "/hello",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
  })

  it('Base URL', () => {
    expect(parseUrl('/base', '/base')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/",
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "/base",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('/base/', '/base')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/",
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "/base/",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('/base', '/base/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/",
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "/base",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('https://example.org/base', '/base')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": "example.org",
        "href": "https://example.org/",
        "origin": "https://example.org",
        "pathname": "/",
        "pathnameOriginal": "/base",
        "port": null,
        "protocol": "https://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('https://example.org/base/', '/base')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": "example.org",
        "href": "https://example.org/",
        "origin": "https://example.org",
        "pathname": "/",
        "pathnameOriginal": "/base/",
        "port": null,
        "protocol": "https://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('https://example.org/base', '/base/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": "example.org",
        "href": "https://example.org/",
        "origin": "https://example.org",
        "pathname": "/",
        "pathnameOriginal": "/base",
        "port": null,
        "protocol": "https://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('/base/hello', '/base')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/hello",
        "origin": null,
        "pathname": "/hello",
        "pathnameOriginal": "/base/hello",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('/hello', '/base')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": true,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/hello",
        "origin": null,
        "pathname": "/hello",
        "pathnameOriginal": "/hello",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('/base/hello', '/base/nested')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": true,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/base/hello",
        "origin": null,
        "pathname": "/base/hello",
        "pathnameOriginal": "/base/hello",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
  })

  it('origin', () => {
    expect(parseUrl('https://example.org/', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": "example.org",
        "href": "https://example.org/",
        "origin": "https://example.org",
        "pathname": "/",
        "pathnameOriginal": "/",
        "port": null,
        "protocol": "https://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('http://example.org/', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": "example.org",
        "href": "http://example.org/",
        "origin": "http://example.org",
        "pathname": "/",
        "pathnameOriginal": "/",
        "port": null,
        "protocol": "http://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('http://example.org', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": "example.org",
        "href": "http://example.org/",
        "origin": "http://example.org",
        "pathname": "/",
        "pathnameOriginal": "",
        "port": null,
        "protocol": "http://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('http://example.org/base/hello', '/base')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": "example.org",
        "href": "http://example.org/hello",
        "origin": "http://example.org",
        "pathname": "/hello",
        "pathnameOriginal": "/base/hello",
        "port": null,
        "protocol": "http://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)

    // Port
    expect(parseUrl('http://localhost:3000/base/hello', '/base')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": "localhost",
        "href": "http://localhost:3000/hello",
        "origin": "http://localhost:3000",
        "pathname": "/hello",
        "pathnameOriginal": "/base/hello",
        "port": 3000,
        "protocol": "http://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('https://example.org:0', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": "example.org",
        "href": "https://example.org:0/",
        "origin": "https://example.org:0",
        "pathname": "/",
        "pathnameOriginal": "",
        "port": 0,
        "protocol": "https://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
  })

  it('hash', () => {
    expect(parseUrl('/#reviews', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "reviews",
        "hashOriginal": "#reviews",
        "hostname": null,
        "href": "/#reviews",
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "/",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('/#', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": "#",
        "hostname": null,
        "href": "/#",
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "/",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('/', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/",
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "/",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('/a/b#', '/a/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": "#",
        "hostname": null,
        "href": "/b#",
        "origin": null,
        "pathname": "/b",
        "pathnameOriginal": "/a/b",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
  })

  it('search', () => {
    expect(parseUrl('/?q=apples', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/?q=apples",
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "/",
        "port": null,
        "protocol": null,
        "search": {
          "q": "apples",
        },
        "searchAll": {
          "q": [
            "apples",
          ],
        },
        "searchOriginal": "?q=apples",
      }
    `)
    expect(parseUrl('/shop?fruits=apples&candies=chocolate,lollipop', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/shop?fruits=apples&candies=chocolate,lollipop",
        "origin": null,
        "pathname": "/shop",
        "pathnameOriginal": "/shop",
        "port": null,
        "protocol": null,
        "search": {
          "candies": "chocolate,lollipop",
          "fruits": "apples",
        },
        "searchAll": {
          "candies": [
            "chocolate,lollipop",
          ],
          "fruits": [
            "apples",
          ],
        },
        "searchOriginal": "?fruits=apples&candies=chocolate,lollipop",
      }
    `)
    const searchQuery = '?fruit=apples&fruit=bananas&candy=chocolate&candy=lollipop&constructor=val1&constructor=val2'
    const { searchOriginal } = parseUrl(`/shop${searchQuery}`, '/')
    assert(searchOriginal)
    const searchParams = new URLSearchParams(searchOriginal)
    expect(searchParams.getAll('fruit')).toMatchInlineSnapshot(`
      [
        "apples",
        "bananas",
      ]
    `)
    expect(searchParams.getAll('candy')).toMatchInlineSnapshot(`
      [
        "chocolate",
        "lollipop",
      ]
    `)
    expect(parseUrl(`/shop${searchQuery}`, '/shop')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/?fruit=apples&fruit=bananas&candy=chocolate&candy=lollipop&constructor=val1&constructor=val2",
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "/shop",
        "port": null,
        "protocol": null,
        "search": {
          "candy": "lollipop",
          "constructor": "val2",
          "fruit": "bananas",
        },
        "searchAll": {
          "candy": [
            "chocolate",
            "lollipop",
          ],
          "constructor": [
            "val1",
            "val2",
          ],
          "fruit": [
            "apples",
            "bananas",
          ],
        },
        "searchOriginal": "?fruit=apples&fruit=bananas&candy=chocolate&candy=lollipop&constructor=val1&constructor=val2",
      }
    `)
  })

  it('decoding', () => {
    // Pathname
    {
      expect(parseUrl('/user/@rom', '/')).toMatchInlineSnapshot(`
        {
          "isBaseMissing": false,
          "hash": "",
          "hashOriginal": null,
          "hostname": null,
          "href": "/user/@rom",
          "origin": null,
          "pathname": "/user/@rom",
          "pathnameOriginal": "/user/@rom",
          "port": null,
          "protocol": null,
          "search": {},
          "searchAll": {},
          "searchOriginal": null,
        }
      `)
      assert(encodeURIComponent('@') === '%40')
      expect(parseUrl('/user/%40rom', '/')).toMatchInlineSnapshot(`
        {
          "isBaseMissing": false,
          "hash": "",
          "hashOriginal": null,
          "hostname": null,
          "href": "/user/%40rom",
          "origin": null,
          "pathname": "/user/@rom",
          "pathnameOriginal": "/user/%40rom",
          "port": null,
          "protocol": null,
          "search": {},
          "searchAll": {},
          "searchOriginal": null,
        }
      `)
      assert(encodeURIComponent('/') === '%2F')
      assert(decodeURIComponent('%2F') === '/')
      assert(decodeURI('%2F') === '%2F')
      expect(parseUrl(`/r${encodeURIComponent('/')}om`, '/')).toMatchInlineSnapshot(`
        {
          "isBaseMissing": false,
          "hash": "",
          "hashOriginal": null,
          "hostname": null,
          "href": "/r%2Fom",
          "origin": null,
          "pathname": "/r%2Fom",
          "pathnameOriginal": "/r%2Fom",
          "port": null,
          "protocol": null,
          "search": {},
          "searchAll": {},
          "searchOriginal": null,
        }
      `)
    }

    // Hash
    {
      expect(parseUrl('/#@reviews', '/')).toMatchInlineSnapshot(`
        {
          "isBaseMissing": false,
          "hash": "@reviews",
          "hashOriginal": "#@reviews",
          "hostname": null,
          "href": "/#@reviews",
          "origin": null,
          "pathname": "/",
          "pathnameOriginal": "/",
          "port": null,
          "protocol": null,
          "search": {},
          "searchAll": {},
          "searchOriginal": null,
        }
      `)
      assert(encodeURIComponent('@') === '%40')
      expect(parseUrl(`/#%40reviews`, '/')).toMatchInlineSnapshot(`
        {
          "isBaseMissing": false,
          "hash": "@reviews",
          "hashOriginal": "#%40reviews",
          "hostname": null,
          "href": "/#%40reviews",
          "origin": null,
          "pathname": "/",
          "pathnameOriginal": "/",
          "port": null,
          "protocol": null,
          "search": {},
          "searchAll": {},
          "searchOriginal": null,
        }
      `)
    }

    // Search
    {
      expect(parseUrl('/?section=@reviews', '/')).toMatchInlineSnapshot(`
        {
          "isBaseMissing": false,
          "hash": "",
          "hashOriginal": null,
          "hostname": null,
          "href": "/?section=@reviews",
          "origin": null,
          "pathname": "/",
          "pathnameOriginal": "/",
          "port": null,
          "protocol": null,
          "search": {
            "section": "@reviews",
          },
          "searchAll": {
            "section": [
              "@reviews",
            ],
          },
          "searchOriginal": "?section=@reviews",
        }
      `)
      assert(encodeURIComponent('@') === '%40')
      expect(parseUrl(`/?section=%40reviews`, '/')).toMatchInlineSnapshot(`
        {
          "isBaseMissing": false,
          "hash": "",
          "hashOriginal": null,
          "hostname": null,
          "href": "/?section=%40reviews",
          "origin": null,
          "pathname": "/",
          "pathnameOriginal": "/",
          "port": null,
          "protocol": null,
          "search": {
            "section": "@reviews",
          },
          "searchAll": {
            "section": [
              "@reviews",
            ],
          },
          "searchOriginal": "?section=%40reviews",
        }
      `)
    }

    // #291
    {
      try {
        decodeURI(decodeURI(encodeURI('%')))
        assert(false)
      } catch (err) {
        assert((err as Error).message === 'URI malformed')
      }
      assert(encodeURIComponent('%') === '%25')
      expect(parseUrl('/user/%25rom', '/')).toMatchInlineSnapshot(`
        {
          "isBaseMissing": false,
          "hash": "",
          "hashOriginal": null,
          "hostname": null,
          "href": "/user/%25rom",
          "origin": null,
          "pathname": "/user/%rom",
          "pathnameOriginal": "/user/%25rom",
          "port": null,
          "protocol": null,
          "search": {},
          "searchAll": {},
          "searchOriginal": null,
        }
      `)
      expect(parseUrl('/user/%rom', '/')).toMatchInlineSnapshot(`
        {
          "isBaseMissing": false,
          "hash": "",
          "hashOriginal": null,
          "hostname": null,
          "href": "/user/%rom",
          "origin": null,
          "pathname": "/user/%rom",
          "pathnameOriginal": "/user/%rom",
          "port": null,
          "protocol": null,
          "search": {},
          "searchAll": {},
          "searchOriginal": null,
        }
      `)
    }
  })

  it('edge cases', () => {
    expect(parseUrl('/product/ö', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/product/ö",
        "origin": null,
        "pathname": "/product/ö",
        "pathnameOriginal": "/product/ö",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('/product/%C3%B6', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/product/%C3%B6",
        "origin": null,
        "pathname": "/product/ö",
        "pathnameOriginal": "/product/%C3%B6",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('/product/แจ็คเก็ตเดนิม', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/product/แจ็คเก็ตเดนิม",
        "origin": null,
        "pathname": "/product/แจ็คเก็ตเดนิม",
        "pathnameOriginal": "/product/แจ็คเก็ตเดนิม",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)

    // #322
    // Remove trailing white space
    expect(parseUrl('/ab ', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/ab ",
        "origin": null,
        "pathname": "/ab",
        "pathnameOriginal": "/ab ",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    // Preserve whitespace otherwise
    assert(encodeURIComponent(' ') === '%20')
    expect(parseUrl('/ab%20', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/ab%20",
        "origin": null,
        "pathname": "/ab ",
        "pathnameOriginal": "/ab%20",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('/a b', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/a b",
        "origin": null,
        "pathname": "/a b",
        "pathnameOriginal": "/a b",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('/a%20b', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/a%20b",
        "origin": null,
        "pathname": "/a b",
        "pathnameOriginal": "/a%20b",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)

    assert(encodeURIComponent('#') === '%23')
    assert(encodeURIComponent('?') === '%3F')
    expect(parseUrl('/a%23/b%3Fc', '/a%23')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/b%3Fc",
        "origin": null,
        "pathname": "/b?c",
        "pathnameOriginal": "/a%23/b%3Fc",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    /* Bug, this doesn't work:
    expect(parseUrl('/a%23/b%3Fc', '/a#')).toMatchInlineSnapshot()
    */

    expect(parseUrl('/a//b', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/a//b",
        "origin": null,
        "pathname": "/a//b",
        "pathnameOriginal": "/a//b",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('http://example.org//', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": "example.org",
        "href": "http://example.org//",
        "origin": "http://example.org",
        "pathname": "//",
        "pathnameOriginal": "//",
        "port": null,
        "protocol": "http://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('//', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "//",
        "origin": null,
        "pathname": "//",
        "pathnameOriginal": "//",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('///', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "///",
        "origin": null,
        "pathname": "///",
        "pathnameOriginal": "///",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)

    // #495
    expect(parseUrl('///en/?redirect_zone=ru', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "///en/?redirect_zone=ru",
        "origin": null,
        "pathname": "///en/",
        "pathnameOriginal": "///en/",
        "port": null,
        "protocol": null,
        "search": {
          "redirect_zone": "ru",
        },
        "searchAll": {
          "redirect_zone": [
            "ru",
          ],
        },
        "searchOriginal": "?redirect_zone=ru",
      }
    `)
  })

  it('missing pathname', () => {
    expect(parseUrl('?a=b', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/?a=b",
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "",
        "port": null,
        "protocol": null,
        "search": {
          "a": "b",
        },
        "searchAll": {
          "a": [
            "b",
          ],
        },
        "searchOriginal": "?a=b",
      }
    `)
    expect(parseUrl('#a', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "a",
        "hashOriginal": "#a",
        "hostname": null,
        "href": "/#a",
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/",
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    assert(new URL('', 'http://fake.org/base').pathname === '/base')
    expect(parseUrl('', '/base')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/",
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
  })

  it('doc example', () => {
    expect(
      parseUrl(
        'https://example.com/some-base-url/hello/s%C3%A9bastien?fruit=%C3%A2pple&fruit=orânge#%C3%A2ge',
        '/some-base-url'
      )
    ).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "âge",
        "hashOriginal": "#%C3%A2ge",
        "hostname": "example.com",
        "href": "https://example.com/hello/s%C3%A9bastien?fruit=%C3%A2pple&fruit=orânge#%C3%A2ge",
        "origin": "https://example.com",
        "pathname": "/hello/sébastien",
        "pathnameOriginal": "/some-base-url/hello/s%C3%A9bastien",
        "port": null,
        "protocol": "https://",
        "search": {
          "fruit": "orânge",
        },
        "searchAll": {
          "fruit": [
            "âpple",
            "orânge",
          ],
        },
        "searchOriginal": "?fruit=%C3%A2pple&fruit=orânge",
      }
    `)
  })

  it('tauri', () => {
    expect(parseUrl('tauri://localhost/', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": "localhost",
        "href": "tauri://localhost/",
        "origin": "tauri://localhost",
        "pathname": "/",
        "pathnameOriginal": "/",
        "port": null,
        "protocol": "tauri://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('tauri://localhost', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": "localhost",
        "href": "tauri://localhost/",
        "origin": "tauri://localhost",
        "pathname": "/",
        "pathnameOriginal": "",
        "port": null,
        "protocol": "tauri://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('tauri://localhost/somePath', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": "localhost",
        "href": "tauri://localhost/somePath",
        "origin": "tauri://localhost",
        "pathname": "/somePath",
        "pathnameOriginal": "/somePath",
        "port": null,
        "protocol": "tauri://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
  })

  // https://github.com/vikejs/vike/issues/1706
  it('capacitor', () => {
    expect(parseUrl('capacitor://localhost/assets/chunks/chunk-v3mOCch-.js', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": "localhost",
        "href": "capacitor://localhost/assets/chunks/chunk-v3mOCch-.js",
        "origin": "capacitor://localhost",
        "pathname": "/assets/chunks/chunk-v3mOCch-.js",
        "pathnameOriginal": "/assets/chunks/chunk-v3mOCch-.js",
        "port": null,
        "protocol": "capacitor://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
  })

  it('relative paths - server-side', () => {
    // Shouldn't this resolve to `{ pathname: '/b1/b2' }`? I don't remember why I used to be fine with following test.
    expect(parseUrl('.', '/b1/b2/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/",
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": ".",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('..', '/b1/b2/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": true,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/b1/",
        "origin": null,
        "pathname": "/b1/",
        "pathnameOriginal": "..",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('../../', '/b1/b2/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": true,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/",
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "../../",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('./markdown', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/markdown",
        "origin": null,
        "pathname": "/markdown",
        "pathnameOriginal": "./markdown",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
  })

  it('relative paths - client-side', () => {
    // @ts-ignore
    globalThis.window = { document: { baseURI: 'http://100.115.92.194:3000/?q=any' } }
    expect(parseUrl('?q=any', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/?q=any",
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "",
        "port": null,
        "protocol": null,
        "search": {
          "q": "any",
        },
        "searchAll": {
          "q": [
            "any",
          ],
        },
        "searchOriginal": "?q=any",
      }
    `)
    // @ts-ignore
    globalThis.window = { document: { baseURI: 'http://localhost:3000/' } }
    expect(parseUrl('./markdown', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/markdown",
        "origin": null,
        "pathname": "/markdown",
        "pathnameOriginal": "./markdown",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    // @ts-ignore
    globalThis.window = { document: { baseURI: 'http://localhost:3000/some/deep/path' } }
    expect(parseUrl('./markdown', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/some/deep/markdown",
        "origin": null,
        "pathname": "/some/deep/markdown",
        "pathnameOriginal": "./markdown",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    // @ts-ignore
    globalThis.window = { document: { baseURI: 'http://localhost:3000/some/deep/' } }
    expect(parseUrl('..//bla', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/some//bla",
        "origin": null,
        "pathname": "/some//bla",
        "pathnameOriginal": "..//bla",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    // @ts-ignore
    globalThis.window = { document: { baseURI: 'http://localhost:3000/some/very/deep/' } }
    expect(parseUrl('../../../../bla', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/bla",
        "origin": null,
        "pathname": "/bla",
        "pathnameOriginal": "../../../../bla",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    // @ts-ignore
    globalThis.window = { document: { baseURI: 'http://localhost:3000/some/dir' } }
    expect(parseUrl('', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/some/dir",
        "origin": null,
        "pathname": "/some/dir",
        "pathnameOriginal": "",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('#', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": "#",
        "hostname": null,
        "href": "/some/dir#",
        "origin": null,
        "pathname": "/some/dir",
        "pathnameOriginal": "",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    // @ts-ignore
    globalThis.window = { document: { baseURI: 'http://localhost:3000/some/dir?some=param' } }
    expect(parseUrl('#', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": "#",
        "hostname": null,
        "href": "/some/dir#",
        "origin": null,
        "pathname": "/some/dir",
        "pathnameOriginal": "",
        "port": null,
        "protocol": null,
        "search": {
          "some": "param",
        },
        "searchAll": {
          "some": [
            "param",
          ],
        },
        "searchOriginal": null,
      }
    `)
    // @ts-ignore
    globalThis.window = undefined
  })

  it('IPV6', () => {
    expect(parseUrl('http://[::1]:3000/', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": "",
        "hashOriginal": null,
        "hostname": "[::1]",
        "href": "http://[::1]:3000/",
        "origin": "http://[::1]:3000",
        "pathname": "/",
        "pathnameOriginal": "/",
        "port": 3000,
        "protocol": "http://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('https://[::1]:3000/bla#:', '/')).toMatchInlineSnapshot(`
      {
        "isBaseMissing": false,
        "hash": ":",
        "hashOriginal": "#:",
        "hostname": "[::1]",
        "href": "https://[::1]:3000/bla#:",
        "origin": "https://[::1]:3000",
        "pathname": "/bla",
        "pathnameOriginal": "/bla",
        "port": 3000,
        "protocol": "https://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
  })
})
/* Doesn't work
declare global {
  var document: Document & { baseURI: string }
}
*/
