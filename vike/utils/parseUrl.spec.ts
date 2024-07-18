import { parseUrl } from './parseUrl.js'
import { expect, describe, it } from 'vitest'
import assert from 'assert'

describe('parseUrl', () => {
  it('basics', () => {
    expect(parseUrl('/', '/')).toMatchInlineSnapshot(`
      {
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "/",
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "/",
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('/hello', '/')).toMatchInlineSnapshot(`
      {
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "/hello",
        "origin": null,
        "pathname": "/hello",
        "pathnameOriginal": "/hello",
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
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "/",
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "/base",
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('/base/', '/base')).toMatchInlineSnapshot(`
      {
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "/",
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "/base/",
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('/base', '/base/')).toMatchInlineSnapshot(`
      {
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "/",
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "/base",
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('https://example.org/base', '/base')).toMatchInlineSnapshot(`
      {
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": "example.org",
        "href": "https://example.org/",
        "origin": "https://example.org",
        "pathname": "/",
        "pathnameOriginal": "/base",
        "protocol": "https://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('https://example.org/base/', '/base')).toMatchInlineSnapshot(`
      {
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": "example.org",
        "href": "https://example.org/",
        "origin": "https://example.org",
        "pathname": "/",
        "pathnameOriginal": "/base/",
        "protocol": "https://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('https://example.org/base', '/base/')).toMatchInlineSnapshot(`
      {
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": "example.org",
        "href": "https://example.org/",
        "origin": "https://example.org",
        "pathname": "/",
        "pathnameOriginal": "/base",
        "protocol": "https://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('/base/hello', '/base')).toMatchInlineSnapshot(`
      {
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "/hello",
        "origin": null,
        "pathname": "/hello",
        "pathnameOriginal": "/base/hello",
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('/hello', '/base')).toMatchInlineSnapshot(`
      {
        "hasBaseServer": false,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "/hello",
        "origin": null,
        "pathname": "/hello",
        "pathnameOriginal": "/hello",
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('/base/hello', '/base/nested')).toMatchInlineSnapshot(`
      {
        "hasBaseServer": false,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "/base/hello",
        "origin": null,
        "pathname": "/base/hello",
        "pathnameOriginal": "/base/hello",
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
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": "example.org",
        "href": "https://example.org/",
        "origin": "https://example.org",
        "pathname": "/",
        "pathnameOriginal": "/",
        "protocol": "https://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('http://example.org/', '/')).toMatchInlineSnapshot(`
      {
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": "example.org",
        "href": "http://example.org/",
        "origin": "http://example.org",
        "pathname": "/",
        "pathnameOriginal": "/",
        "protocol": "http://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('http://example.org', '/')).toMatchInlineSnapshot(`
      {
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": "example.org",
        "href": "http://example.org/",
        "origin": "http://example.org",
        "pathname": "/",
        "pathnameOriginal": "",
        "protocol": "http://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('http://example.org/base/hello', '/base')).toMatchInlineSnapshot(`
      {
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": "example.org",
        "href": "http://example.org/hello",
        "origin": "http://example.org",
        "pathname": "/hello",
        "pathnameOriginal": "/base/hello",
        "protocol": "http://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
  })

  it('hash', () => {
    expect(parseUrl('/#reviews', '/')).toMatchInlineSnapshot(`
      {
        "hasBaseServer": true,
        "hash": "reviews",
        "hashOriginal": "#reviews",
        "host": null,
        "href": "/#reviews",
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "/",
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('/#', '/')).toMatchInlineSnapshot(`
      {
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": "#",
        "host": null,
        "href": "/#",
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "/",
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('/', '/')).toMatchInlineSnapshot(`
      {
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "/",
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "/",
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('/a/b#', '/a/')).toMatchInlineSnapshot(`
      {
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": "#",
        "host": null,
        "href": "/b#",
        "origin": null,
        "pathname": "/b",
        "pathnameOriginal": "/a/b",
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
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "/?q=apples",
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "/",
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
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "/shop?fruits=apples&candies=chocolate,lollipop",
        "origin": null,
        "pathname": "/shop",
        "pathnameOriginal": "/shop",
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
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "/?fruit=apples&fruit=bananas&candy=chocolate&candy=lollipop&constructor=val1&constructor=val2",
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "/shop",
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
          "hasBaseServer": true,
          "hash": "",
          "hashOriginal": null,
          "host": null,
          "href": "/user/@rom",
          "origin": null,
          "pathname": "/user/@rom",
          "pathnameOriginal": "/user/@rom",
          "protocol": null,
          "search": {},
          "searchAll": {},
          "searchOriginal": null,
        }
      `)
      assert(encodeURIComponent('@') === '%40')
      expect(parseUrl('/user/%40rom', '/')).toMatchInlineSnapshot(`
        {
          "hasBaseServer": true,
          "hash": "",
          "hashOriginal": null,
          "host": null,
          "href": "/user/@rom",
          "origin": null,
          "pathname": "/user/@rom",
          "pathnameOriginal": "/user/%40rom",
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
          "hasBaseServer": true,
          "hash": "",
          "hashOriginal": null,
          "host": null,
          "href": "/r%2Fom",
          "origin": null,
          "pathname": "/r%2Fom",
          "pathnameOriginal": "/r%2Fom",
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
          "hasBaseServer": true,
          "hash": "@reviews",
          "hashOriginal": "#@reviews",
          "host": null,
          "href": "/#@reviews",
          "origin": null,
          "pathname": "/",
          "pathnameOriginal": "/",
          "protocol": null,
          "search": {},
          "searchAll": {},
          "searchOriginal": null,
        }
      `)
      assert(encodeURIComponent('@') === '%40')
      expect(parseUrl(`/#%40reviews`, '/')).toMatchInlineSnapshot(`
        {
          "hasBaseServer": true,
          "hash": "@reviews",
          "hashOriginal": "#%40reviews",
          "host": null,
          "href": "/#%40reviews",
          "origin": null,
          "pathname": "/",
          "pathnameOriginal": "/",
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
          "hasBaseServer": true,
          "hash": "",
          "hashOriginal": null,
          "host": null,
          "href": "/?section=@reviews",
          "origin": null,
          "pathname": "/",
          "pathnameOriginal": "/",
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
          "hasBaseServer": true,
          "hash": "",
          "hashOriginal": null,
          "host": null,
          "href": "/?section=%40reviews",
          "origin": null,
          "pathname": "/",
          "pathnameOriginal": "/",
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
          "hasBaseServer": true,
          "hash": "",
          "hashOriginal": null,
          "host": null,
          "href": "/user/%rom",
          "origin": null,
          "pathname": "/user/%rom",
          "pathnameOriginal": "/user/%25rom",
          "protocol": null,
          "search": {},
          "searchAll": {},
          "searchOriginal": null,
        }
      `)
      expect(parseUrl('/user/%rom', '/')).toMatchInlineSnapshot(`
        {
          "hasBaseServer": true,
          "hash": "",
          "hashOriginal": null,
          "host": null,
          "href": "/user/%rom",
          "origin": null,
          "pathname": "/user/%rom",
          "pathnameOriginal": "/user/%rom",
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
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "/product/ö",
        "origin": null,
        "pathname": "/product/ö",
        "pathnameOriginal": "/product/ö",
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('/product/%C3%B6', '/')).toMatchInlineSnapshot(`
      {
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "/product/ö",
        "origin": null,
        "pathname": "/product/ö",
        "pathnameOriginal": "/product/%C3%B6",
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('/product/แจ็คเก็ตเดนิม', '/')).toMatchInlineSnapshot(`
      {
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "/product/แจ็คเก็ตเดนิม",
        "origin": null,
        "pathname": "/product/แจ็คเก็ตเดนิม",
        "pathnameOriginal": "/product/แจ็คเก็ตเดนิม",
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
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "/ab",
        "origin": null,
        "pathname": "/ab",
        "pathnameOriginal": "/ab ",
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
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "/ab ",
        "origin": null,
        "pathname": "/ab ",
        "pathnameOriginal": "/ab%20",
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('/a b', '/')).toMatchInlineSnapshot(`
      {
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "/a b",
        "origin": null,
        "pathname": "/a b",
        "pathnameOriginal": "/a b",
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('/a%20b', '/')).toMatchInlineSnapshot(`
      {
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "/a b",
        "origin": null,
        "pathname": "/a b",
        "pathnameOriginal": "/a%20b",
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
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "/b?c",
        "origin": null,
        "pathname": "/b?c",
        "pathnameOriginal": "/a%23/b%3Fc",
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
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "/a//b",
        "origin": null,
        "pathname": "/a//b",
        "pathnameOriginal": "/a//b",
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('http://example.org//', '/')).toMatchInlineSnapshot(`
      {
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": "example.org",
        "href": "http://example.org//",
        "origin": "http://example.org",
        "pathname": "//",
        "pathnameOriginal": "//",
        "protocol": "http://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('//', '/')).toMatchInlineSnapshot(`
      {
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "//",
        "origin": null,
        "pathname": "//",
        "pathnameOriginal": "//",
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('///', '/')).toMatchInlineSnapshot(`
      {
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "///",
        "origin": null,
        "pathname": "///",
        "pathnameOriginal": "///",
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)

    // #495
    expect(parseUrl('///en/?redirect_zone=ru', '/')).toMatchInlineSnapshot(`
      {
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "///en/?redirect_zone=ru",
        "origin": null,
        "pathname": "///en/",
        "pathnameOriginal": "///en/",
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
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "/?a=b",
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "",
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
        "hasBaseServer": true,
        "hash": "a",
        "hashOriginal": "#a",
        "host": null,
        "href": "/#a",
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "",
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('', '/')).toMatchInlineSnapshot(`
      {
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "/",
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "",
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    assert(new URL('', 'http://fake.org/base').pathname === '/base')
    expect(parseUrl('', '/base')).toMatchInlineSnapshot(`
      {
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "/",
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "",
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
        "hasBaseServer": true,
        "hash": "âge",
        "hashOriginal": "#%C3%A2ge",
        "host": "example.com",
        "href": "https://example.com/hello/sébastien?fruit=%C3%A2pple&fruit=orânge#%C3%A2ge",
        "origin": "https://example.com",
        "pathname": "/hello/sébastien",
        "pathnameOriginal": "/some-base-url/hello/s%C3%A9bastien",
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
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": "localhost",
        "href": "tauri://localhost/",
        "origin": "tauri://localhost",
        "pathname": "/",
        "pathnameOriginal": "/",
        "protocol": "tauri://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('tauri://localhost', '/')).toMatchInlineSnapshot(`
      {
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": "localhost",
        "href": "tauri://localhost/",
        "origin": "tauri://localhost",
        "pathname": "/",
        "pathnameOriginal": "",
        "protocol": "tauri://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('tauri://localhost/somePath', '/')).toMatchInlineSnapshot(`
      {
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": "localhost",
        "href": "tauri://localhost/somePath",
        "origin": "tauri://localhost",
        "pathname": "/somePath",
        "pathnameOriginal": "/somePath",
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
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": "localhost",
        "href": "capacitor://localhost/assets/chunks/chunk-v3mOCch-.js",
        "origin": "capacitor://localhost",
        "pathname": "/assets/chunks/chunk-v3mOCch-.js",
        "pathnameOriginal": "/assets/chunks/chunk-v3mOCch-.js",
        "protocol": "capacitor://",
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
  })

  it('relative paths', () => {
    expect(parseUrl('.', '/b1/b2/')).toMatchInlineSnapshot(`
      {
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "/",
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": ".",
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('..', '/b1/b2/')).toMatchInlineSnapshot(`
      {
        "hasBaseServer": false,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "/b1/",
        "origin": null,
        "pathname": "/b1/",
        "pathnameOriginal": "..",
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('../../', '/b1/b2/')).toMatchInlineSnapshot(`
      {
        "hasBaseServer": false,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "/",
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "../../",
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    expect(parseUrl('./markdown', '/')).toMatchInlineSnapshot(`
      {
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "/markdown",
        "origin": null,
        "pathname": "/markdown",
        "pathnameOriginal": "./markdown",
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
  })
  it('relative paths - browser-side', () => {
    // @ts-ignore
    globalThis.window = { document: { baseURI: 'http://100.115.92.194:3000/?q=any' } }
    expect(parseUrl('?q=any', '/')).toMatchInlineSnapshot(`
      {
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "/?q=any",
        "origin": null,
        "pathname": "/",
        "pathnameOriginal": "",
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
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "/markdown",
        "origin": null,
        "pathname": "/markdown",
        "pathnameOriginal": "./markdown",
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
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "/some/deep/markdown",
        "origin": null,
        "pathname": "/some/deep/markdown",
        "pathnameOriginal": "./markdown",
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
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "/some//bla",
        "origin": null,
        "pathname": "/some//bla",
        "pathnameOriginal": "..//bla",
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
        "hasBaseServer": true,
        "hash": "",
        "hashOriginal": null,
        "host": null,
        "href": "/bla",
        "origin": null,
        "pathname": "/bla",
        "pathnameOriginal": "../../../../bla",
        "protocol": null,
        "search": {},
        "searchAll": {},
        "searchOriginal": null,
      }
    `)
    // @ts-ignore
    globalThis.window = undefined
  })
})
/* Doesn't work
declare global {
  var document: Document & { baseURI: string }
}
*/
