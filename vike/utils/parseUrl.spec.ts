import { parseUrl } from './parseUrl.js'
import { expect, describe, it } from 'vitest'
import assert from 'assert'

const p = (...args: Parameters<typeof parseUrl>) => {
  const res = parseUrl(...args)
  return { ...res, searchParams: res.searchParams.toString() }
}

describe('parseUrl', () => {
  it('basics', () => {
    expect(p('/', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/",
        "isBaseMissing": false,
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "/",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    expect(p('/hello', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/hello",
        "isBaseMissing": false,
        "origin": null,
        "pathname": "/hello",
        "pathnameOriginal": "/hello",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
  })

  it('Base URL', () => {
    expect(p('/base', '/base')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/",
        "isBaseMissing": false,
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "/base",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    expect(p('/base/', '/base')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/",
        "isBaseMissing": false,
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "/base/",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    expect(p('/base', '/base/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/",
        "isBaseMissing": false,
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "/base",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    expect(p('https://example.org/base', '/base')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": "example.org",
        "href": "https://example.org/",
        "isBaseMissing": false,
        "origin": "https://example.org",
        "pathname": "/",
        "pathnameOriginal": "/base",
        "port": null,
        "protocol": "https://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    expect(p('https://example.org/base/', '/base')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": "example.org",
        "href": "https://example.org/",
        "isBaseMissing": false,
        "origin": "https://example.org",
        "pathname": "/",
        "pathnameOriginal": "/base/",
        "port": null,
        "protocol": "https://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    expect(p('https://example.org/base', '/base/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": "example.org",
        "href": "https://example.org/",
        "isBaseMissing": false,
        "origin": "https://example.org",
        "pathname": "/",
        "pathnameOriginal": "/base",
        "port": null,
        "protocol": "https://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    expect(p('/base/hello', '/base')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/hello",
        "isBaseMissing": false,
        "origin": null,
        "pathname": "/hello",
        "pathnameOriginal": "/base/hello",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    expect(p('/hello', '/base')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/hello",
        "isBaseMissing": true,
        "origin": null,
        "pathname": "/hello",
        "pathnameOriginal": "/hello",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    expect(p('/base/hello', '/base/nested')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/base/hello",
        "isBaseMissing": true,
        "origin": null,
        "pathname": "/base/hello",
        "pathnameOriginal": "/base/hello",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
  })

  it('origin', () => {
    expect(p('https://example.org/', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": "example.org",
        "href": "https://example.org/",
        "isBaseMissing": false,
        "origin": "https://example.org",
        "pathname": "/",
        "pathnameOriginal": "/",
        "port": null,
        "protocol": "https://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    expect(p('http://example.org/', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": "example.org",
        "href": "http://example.org/",
        "isBaseMissing": false,
        "origin": "http://example.org",
        "pathname": "/",
        "pathnameOriginal": "/",
        "port": null,
        "protocol": "http://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    expect(p('http://example.org', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": "example.org",
        "href": "http://example.org/",
        "isBaseMissing": false,
        "origin": "http://example.org",
        "pathname": "/",
        "pathnameOriginal": "",
        "port": null,
        "protocol": "http://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    expect(p('http://example.org/base/hello', '/base')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": "example.org",
        "href": "http://example.org/hello",
        "isBaseMissing": false,
        "origin": "http://example.org",
        "pathname": "/hello",
        "pathnameOriginal": "/base/hello",
        "port": null,
        "protocol": "http://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)

    // Port
    expect(p('http://localhost:3000/base/hello', '/base')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": "localhost",
        "href": "http://localhost:3000/hello",
        "isBaseMissing": false,
        "origin": "http://localhost:3000",
        "pathname": "/hello",
        "pathnameOriginal": "/base/hello",
        "port": 3000,
        "protocol": "http://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    expect(p('https://example.org:0', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": "example.org",
        "href": "https://example.org:0/",
        "isBaseMissing": false,
        "origin": "https://example.org:0",
        "pathname": "/",
        "pathnameOriginal": "",
        "port": 0,
        "protocol": "https://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
  })

  it('hash', () => {
    expect(p('/#reviews', '/')).toMatchInlineSnapshot(`
      {
        "hash": "reviews",
        "hashOriginal": "#reviews",
        "hostname": null,
        "href": "/#reviews",
        "isBaseMissing": false,
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "/",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    expect(p('/#', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": "#",
        "hostname": null,
        "href": "/#",
        "isBaseMissing": false,
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "/",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    expect(p('/', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/",
        "isBaseMissing": false,
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "/",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    expect(p('/a/b#', '/a/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": "#",
        "hostname": null,
        "href": "/b#",
        "isBaseMissing": false,
        "origin": null,
        "pathname": "/b",
        "pathnameOriginal": "/a/b",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
  })

  it('search', () => {
    expect(p('/?q=apples', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/?q=apples",
        "isBaseMissing": false,
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
        "searchParams": "q=apples",
      }
    `)
    expect(p('/shop?fruits=apples&candies=chocolate,lollipop', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/shop?fruits=apples&candies=chocolate,lollipop",
        "isBaseMissing": false,
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
        "searchParams": "fruits=apples&candies=chocolate%2Clollipop",
      }
    `)
    const searchQuery = '?fruit=apples&fruit=bananas&candy=chocolate&candy=lollipop&constructor=val1&constructor=val2'
    const { searchOriginal } = p(`/shop${searchQuery}`, '/')
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
    expect(p(`/shop${searchQuery}`, '/shop')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/?fruit=apples&fruit=bananas&candy=chocolate&candy=lollipop&constructor=val1&constructor=val2",
        "isBaseMissing": false,
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
        "searchParams": "fruit=apples&fruit=bananas&candy=chocolate&candy=lollipop&constructor=val1&constructor=val2",
      }
    `)
  })

  it('decoding', () => {
    // Pathname
    {
      expect(p('/user/@rom', '/')).toMatchInlineSnapshot(`
        {
          "hash": "",
          "hashOriginal": null,
          "hostname": null,
          "href": "/user/@rom",
          "isBaseMissing": false,
          "origin": null,
          "pathname": "/user/@rom",
          "pathnameOriginal": "/user/@rom",
          "port": null,
          "protocol": null,
          "search": {},
          "searchAll": {},
          "searchOriginal": null,
          "searchParams": "",
        }
      `)
      assert(encodeURIComponent('@') === '%40')
      expect(p('/user/%40rom', '/')).toMatchInlineSnapshot(`
        {
          "hash": "",
          "hashOriginal": null,
          "hostname": null,
          "href": "/user/%40rom",
          "isBaseMissing": false,
          "origin": null,
          "pathname": "/user/@rom",
          "pathnameOriginal": "/user/%40rom",
          "port": null,
          "protocol": null,
          "search": {},
          "searchAll": {},
          "searchOriginal": null,
          "searchParams": "",
        }
      `)
      assert(encodeURIComponent('/') === '%2F')
      assert(decodeURIComponent('%2F') === '/')
      assert(decodeURI('%2F') === '%2F')
      expect(p(`/r${encodeURIComponent('/')}om`, '/')).toMatchInlineSnapshot(`
        {
          "hash": "",
          "hashOriginal": null,
          "hostname": null,
          "href": "/r%2Fom",
          "isBaseMissing": false,
          "origin": null,
          "pathname": "/r%2Fom",
          "pathnameOriginal": "/r%2Fom",
          "port": null,
          "protocol": null,
          "search": {},
          "searchAll": {},
          "searchOriginal": null,
          "searchParams": "",
        }
      `)
    }

    // Hash
    {
      expect(p('/#@reviews', '/')).toMatchInlineSnapshot(`
        {
          "hash": "@reviews",
          "hashOriginal": "#@reviews",
          "hostname": null,
          "href": "/#@reviews",
          "isBaseMissing": false,
          "origin": null,
          "pathname": "/",
          "pathnameOriginal": "/",
          "port": null,
          "protocol": null,
          "search": {},
          "searchAll": {},
          "searchOriginal": null,
          "searchParams": "",
        }
      `)
      assert(encodeURIComponent('@') === '%40')
      expect(p(`/#%40reviews`, '/')).toMatchInlineSnapshot(`
        {
          "hash": "@reviews",
          "hashOriginal": "#%40reviews",
          "hostname": null,
          "href": "/#%40reviews",
          "isBaseMissing": false,
          "origin": null,
          "pathname": "/",
          "pathnameOriginal": "/",
          "port": null,
          "protocol": null,
          "search": {},
          "searchAll": {},
          "searchOriginal": null,
          "searchParams": "",
        }
      `)
    }

    // Search
    {
      expect(p('/?section=@reviews', '/')).toMatchInlineSnapshot(`
        {
          "hash": "",
          "hashOriginal": null,
          "hostname": null,
          "href": "/?section=@reviews",
          "isBaseMissing": false,
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
          "searchParams": "section=%40reviews",
        }
      `)
      assert(encodeURIComponent('@') === '%40')
      expect(p(`/?section=%40reviews`, '/')).toMatchInlineSnapshot(`
        {
          "hash": "",
          "hashOriginal": null,
          "hostname": null,
          "href": "/?section=%40reviews",
          "isBaseMissing": false,
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
          "searchParams": "section=%40reviews",
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
      expect(p('/user/%25rom', '/')).toMatchInlineSnapshot(`
        {
          "hash": "",
          "hashOriginal": null,
          "hostname": null,
          "href": "/user/%25rom",
          "isBaseMissing": false,
          "origin": null,
          "pathname": "/user/%rom",
          "pathnameOriginal": "/user/%25rom",
          "port": null,
          "protocol": null,
          "search": {},
          "searchAll": {},
          "searchOriginal": null,
          "searchParams": "",
        }
      `)
      expect(p('/user/%rom', '/')).toMatchInlineSnapshot(`
        {
          "hash": "",
          "hashOriginal": null,
          "hostname": null,
          "href": "/user/%rom",
          "isBaseMissing": false,
          "origin": null,
          "pathname": "/user/%rom",
          "pathnameOriginal": "/user/%rom",
          "port": null,
          "protocol": null,
          "search": {},
          "searchAll": {},
          "searchOriginal": null,
          "searchParams": "",
        }
      `)
    }
  })

  it('edge cases', () => {
    expect(p('/product/ö', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/product/ö",
        "isBaseMissing": false,
        "origin": null,
        "pathname": "/product/ö",
        "pathnameOriginal": "/product/ö",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    expect(p('/product/%C3%B6', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/product/%C3%B6",
        "isBaseMissing": false,
        "origin": null,
        "pathname": "/product/ö",
        "pathnameOriginal": "/product/%C3%B6",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    expect(p('/product/แจ็คเก็ตเดนิม', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/product/แจ็คเก็ตเดนิม",
        "isBaseMissing": false,
        "origin": null,
        "pathname": "/product/แจ็คเก็ตเดนิม",
        "pathnameOriginal": "/product/แจ็คเก็ตเดนิม",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)

    // #322
    // Remove trailing white space
    expect(p('/ab ', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/ab ",
        "isBaseMissing": false,
        "origin": null,
        "pathname": "/ab",
        "pathnameOriginal": "/ab ",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    // Preserve whitespace otherwise
    assert(encodeURIComponent(' ') === '%20')
    expect(p('/ab%20', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/ab%20",
        "isBaseMissing": false,
        "origin": null,
        "pathname": "/ab ",
        "pathnameOriginal": "/ab%20",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    expect(p('/a b', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/a b",
        "isBaseMissing": false,
        "origin": null,
        "pathname": "/a b",
        "pathnameOriginal": "/a b",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    expect(p('/a%20b', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/a%20b",
        "isBaseMissing": false,
        "origin": null,
        "pathname": "/a b",
        "pathnameOriginal": "/a%20b",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)

    assert(encodeURIComponent('#') === '%23')
    assert(encodeURIComponent('?') === '%3F')
    expect(p('/a%23/b%3Fc', '/a%23')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/b%3Fc",
        "isBaseMissing": false,
        "origin": null,
        "pathname": "/b?c",
        "pathnameOriginal": "/a%23/b%3Fc",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    /* Bug, this doesn't work:
    expect(parseUrl('/a%23/b%3Fc', '/a#')).toMatchInlineSnapshot()
    */

    expect(p('/a//b', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/a//b",
        "isBaseMissing": false,
        "origin": null,
        "pathname": "/a//b",
        "pathnameOriginal": "/a//b",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    expect(p('http://example.org//', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": "example.org",
        "href": "http://example.org//",
        "isBaseMissing": false,
        "origin": "http://example.org",
        "pathname": "//",
        "pathnameOriginal": "//",
        "port": null,
        "protocol": "http://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    expect(p('//', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "//",
        "isBaseMissing": false,
        "origin": null,
        "pathname": "//",
        "pathnameOriginal": "//",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    expect(p('///', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "///",
        "isBaseMissing": false,
        "origin": null,
        "pathname": "///",
        "pathnameOriginal": "///",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)

    // #495
    expect(p('///en/?redirect_zone=ru', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "///en/?redirect_zone=ru",
        "isBaseMissing": false,
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
        "searchParams": "redirect_zone=ru",
      }
    `)
  })

  it('missing pathname', () => {
    expect(p('?a=b', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/?a=b",
        "isBaseMissing": false,
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
        "searchParams": "a=b",
      }
    `)
    expect(p('#a', '/')).toMatchInlineSnapshot(`
      {
        "hash": "a",
        "hashOriginal": "#a",
        "hostname": null,
        "href": "/#a",
        "isBaseMissing": false,
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    expect(p('', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/",
        "isBaseMissing": false,
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    assert(new URL('', 'http://fake.org/base').pathname === '/base')
    expect(p('', '/base')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/",
        "isBaseMissing": false,
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
  })

  it('doc example', () => {
    expect(
      p(
        'https://example.com/some-base-url/hello/s%C3%A9bastien?fruit=%C3%A2pple&fruit=orânge#%C3%A2ge',
        '/some-base-url'
      )
    ).toMatchInlineSnapshot(`
      {
        "hash": "âge",
        "hashOriginal": "#%C3%A2ge",
        "hostname": "example.com",
        "href": "https://example.com/hello/s%C3%A9bastien?fruit=%C3%A2pple&fruit=orânge#%C3%A2ge",
        "isBaseMissing": false,
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
        "searchParams": "fruit=%C3%A2pple&fruit=or%C3%A2nge",
      }
    `)
  })

  it('tauri', () => {
    expect(p('tauri://localhost/', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": "localhost",
        "href": "tauri://localhost/",
        "isBaseMissing": false,
        "origin": "tauri://localhost",
        "pathname": "/",
        "pathnameOriginal": "/",
        "port": null,
        "protocol": "tauri://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    expect(p('tauri://localhost', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": "localhost",
        "href": "tauri://localhost/",
        "isBaseMissing": false,
        "origin": "tauri://localhost",
        "pathname": "/",
        "pathnameOriginal": "",
        "port": null,
        "protocol": "tauri://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    expect(p('tauri://localhost/somePath', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": "localhost",
        "href": "tauri://localhost/somePath",
        "isBaseMissing": false,
        "origin": "tauri://localhost",
        "pathname": "/somePath",
        "pathnameOriginal": "/somePath",
        "port": null,
        "protocol": "tauri://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
  })

  // https://github.com/vikejs/vike/issues/1706
  it('capacitor', () => {
    expect(p('capacitor://localhost/assets/chunks/chunk-v3mOCch-.js', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": "localhost",
        "href": "capacitor://localhost/assets/chunks/chunk-v3mOCch-.js",
        "isBaseMissing": false,
        "origin": "capacitor://localhost",
        "pathname": "/assets/chunks/chunk-v3mOCch-.js",
        "pathnameOriginal": "/assets/chunks/chunk-v3mOCch-.js",
        "port": null,
        "protocol": "capacitor://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
  })

  it('relative paths - server-side', () => {
    // Shouldn't this resolve to `{ pathname: '/b1/b2' }`? I don't remember why I used to be fine with following test.
    expect(p('.', '/b1/b2/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/",
        "isBaseMissing": false,
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": ".",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    expect(p('..', '/b1/b2/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/b1/",
        "isBaseMissing": true,
        "origin": null,
        "pathname": "/b1/",
        "pathnameOriginal": "..",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    expect(p('../../', '/b1/b2/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/",
        "isBaseMissing": true,
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "../../",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    expect(p('./markdown', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/markdown",
        "isBaseMissing": false,
        "origin": null,
        "pathname": "/markdown",
        "pathnameOriginal": "./markdown",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
  })

  it('relative paths - client-side', () => {
    // @ts-ignore
    globalThis.window = { document: { baseURI: 'http://100.115.92.194:3000/?q=any' } }
    expect(p('?q=any', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/?q=any",
        "isBaseMissing": false,
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
        "searchParams": "q=any",
      }
    `)
    // @ts-ignore
    globalThis.window = { document: { baseURI: 'http://localhost:3000/' } }
    expect(p('./markdown', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/markdown",
        "isBaseMissing": false,
        "origin": null,
        "pathname": "/markdown",
        "pathnameOriginal": "./markdown",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    // @ts-ignore
    globalThis.window = { document: { baseURI: 'http://localhost:3000/some/deep/path' } }
    expect(p('./markdown', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/some/deep/markdown",
        "isBaseMissing": false,
        "origin": null,
        "pathname": "/some/deep/markdown",
        "pathnameOriginal": "./markdown",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    // @ts-ignore
    globalThis.window = { document: { baseURI: 'http://localhost:3000/some/deep/' } }
    expect(p('..//bla', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/some//bla",
        "isBaseMissing": false,
        "origin": null,
        "pathname": "/some//bla",
        "pathnameOriginal": "..//bla",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    // @ts-ignore
    globalThis.window = { document: { baseURI: 'http://localhost:3000/some/very/deep/' } }
    expect(p('../../../../bla', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/bla",
        "isBaseMissing": false,
        "origin": null,
        "pathname": "/bla",
        "pathnameOriginal": "../../../../bla",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    // @ts-ignore
    globalThis.window = { document: { baseURI: 'http://localhost:3000/some/dir' } }
    expect(p('', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": null,
        "href": "/some/dir",
        "isBaseMissing": false,
        "origin": null,
        "pathname": "/some/dir",
        "pathnameOriginal": "",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    expect(p('#', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": "#",
        "hostname": null,
        "href": "/some/dir#",
        "isBaseMissing": false,
        "origin": null,
        "pathname": "/some/dir",
        "pathnameOriginal": "",
        "port": null,
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    // @ts-ignore
    globalThis.window = { document: { baseURI: 'http://localhost:3000/some/dir?some=param' } }
    expect(p('#', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": "#",
        "hostname": null,
        "href": "/some/dir#",
        "isBaseMissing": false,
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
        "searchParams": "some=param",
      }
    `)
    // @ts-ignore
    globalThis.window = undefined
  })

  it('IPV6', () => {
    expect(p('http://[::1]:3000/', '/')).toMatchInlineSnapshot(`
      {
        "hash": "",
        "hashOriginal": null,
        "hostname": "[::1]",
        "href": "http://[::1]:3000/",
        "isBaseMissing": false,
        "origin": "http://[::1]:3000",
        "pathname": "/",
        "pathnameOriginal": "/",
        "port": 3000,
        "protocol": "http://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
    expect(p('https://[::1]:3000/bla#:', '/')).toMatchInlineSnapshot(`
      {
        "hash": ":",
        "hashOriginal": "#:",
        "hostname": "[::1]",
        "href": "https://[::1]:3000/bla#:",
        "isBaseMissing": false,
        "origin": "https://[::1]:3000",
        "pathname": "/bla",
        "pathnameOriginal": "/bla",
        "port": 3000,
        "protocol": "https://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
        "searchParams": "",
      }
    `)
  })
})
/* Doesn't work
declare global {
  var document: Document & { baseURI: string }
}
*/
