import { assert } from './assert'
import { slice } from './slice'

export { handleUrlOrigin }
export { addUrlOrigin }

export { getUrlFull }
export { getUrlPathname }
export { getUrlParsed }
export { getUrlParts }
export { getUrlFullWithoutHash }
export type { UrlParsed }

function handleUrlOrigin(url: string): { urlWithoutOrigin: string; urlOrigin: null | string } {
  const urlOrigin = parseWithNewUrl(url).origin
  if (!urlOrigin) {
    return { urlWithoutOrigin: url, urlOrigin: null }
  }
  assert(urlOrigin.startsWith('http'), { url })
  assert(url.startsWith(urlOrigin), { url })
  const urlWithoutOrigin = url.slice(urlOrigin.length)
  assert(`${urlOrigin}${urlWithoutOrigin}` === url, { url })
  assert(urlWithoutOrigin.startsWith('/'), { url })
  return { urlWithoutOrigin, urlOrigin }
}
function addUrlOrigin(url: string, urlOrigin: string): string {
  assert(urlOrigin.startsWith('http'), { url, urlOrigin })
  if (urlOrigin.endsWith('/')) {
    urlOrigin = slice(urlOrigin, 0, -1)
  }
  assert(!urlOrigin.endsWith('/'), { url, urlOrigin })
  assert(url.startsWith('/'), { url, urlOrigin })
  return `${urlOrigin}${url}`
}

/**
 Returns `${pathname}${search}${hash}`. (Basically removes the origin.)
*/
function getUrlFull(url?: string): string {
  url = retrieveUrl(url)
  return handleUrlOrigin(url).urlWithoutOrigin
}

/**
 Returns `${pathname}`
*/
function getUrlPathname(url?: string): string {
  url = retrieveUrl(url)
  const { pathname } = parseWithNewUrl(url)
  const urlPathname = pathname
  return urlPathname
}

function getUrlParts(url?: string): {
  origin: string | null
  pathname: string
  searchString: string
  hashString: string
} {
  url = retrieveUrl(url)

  const [urlWithoutHash, ...hashList] = url.split('#')
  assert(urlWithoutHash)
  const hashString = ['', ...hashList].join('#')

  const [urlWithoutSearch, ...searchList] = urlWithoutHash.split('?')
  assert(urlWithoutSearch)
  const searchString = ['', ...searchList].join('?')

  const { origin, pathname: pathnameFromNewUrl } = parseWithNewUrl(urlWithoutSearch)
  assert(origin === null || url.startsWith(origin), { url })
  const pathname = urlWithoutSearch.slice((origin || '').length)
  assert(pathname === pathnameFromNewUrl, { url })

  const urlRecreated = `${origin || ''}${pathname}${searchString}${hashString}`
  assert(url === urlRecreated, { urlRecreated, url })
  return { origin, pathname, searchString, hashString }
}

type UrlParsed = {
  origin: null | string
  pathname: string
  search: null | Record<string, string>
  hash: null | string
}
function getUrlParsed(url?: string): UrlParsed {
  url = retrieveUrl(url)

  const { origin, pathname, searchString, hashString } = getUrlParts(url)

  assert(searchString === '' || searchString.startsWith('?'))
  const search = searchString === '' ? null : Object.fromEntries(Array.from(new URLSearchParams(searchString)))

  assert(hashString === '' || hashString.startsWith('#'))
  const hash = hashString === '' ? null : decodeURIComponent(hashString.slice(1))

  assert(pathname.startsWith('/'))
  assert(url.startsWith(`${origin || ''}${pathname}`))
  return { origin, pathname, search, hash }
}

function getUrlFullWithoutHash(url?: string): string {
  const urlFull = getUrlFull(url)
  const urlFullWithoutHash = urlFull.split('#')[0]
  assert(urlFullWithoutHash)
  return urlFullWithoutHash
}

function retrieveUrl(url: undefined | string) {
  if (!url) {
    url = window.location.href
  }
  return url
}

function parseWithNewUrl(url: string): { origin: string | null; pathname: string } {
  let origin: string | null
  let pathname: string
  try {
    // `new URL(url)` throws an error if `url` doesn't have an origin
    const urlParsed = new URL(url)
    origin = urlParsed.origin
    pathname = urlParsed.pathname
  } catch (err) {
    // `url` has no origin
    origin = null
    // In the browser, this is the Base URL of the current URL
    const currentBase =
      typeof window !== 'undefined' &&
      // We need to access safely in case the user sets `window` in Node.js
      window?.document?.baseURI
    // We cannot resolve relative URLs in Node.js
    assert(currentBase || !url.startsWith('.'))
    // Is there any other kind of URLs that vite-plugin-ssr should support?
    assert(currentBase || url.startsWith('/') || url.startsWith('?'))
    const fakeBase = currentBase || 'http://fake-origin.example.org'
    // Supports:
    //  - `url === '/absolute/path'`
    //  - `url === './relative/path'`
    //  - `url === '?queryWithoutPath'`
    const urlParsed = new URL(url, fakeBase)
    pathname = urlParsed.pathname
  }

  assert(pathname.startsWith('/'), { url, pathname })
  // The URL pathname should be the URL without origin, query string, and hash.
  //  - https://developer.mozilla.org/en-US/docs/Web/API/URL/pathname
  assert(pathname === pathname.split('?')[0]!.split('#')[0], { pathname })

  return { origin, pathname }
}

/* Attempt to also apply `cleanUrl()` on `pageContext.urlNormalized` but AFAICT no one needs this; `pageContext.urlParsed` is enough.
 *
function cleanUrl(url: string): string {
  return getUrlFromParsed(getUrlParsed(url))
}

function getUrlFromParsed(urlParsed: UrlParsed): string {
  const { origin, pathname, search, hash } = urlParsed

  const searchParams = new URLSearchParams('')
  assert(Array.from(searchParams.keys()).length === 0)
  Object.entries(search || {}).forEach(([key, val]) => {
    searchParams.set(key, val)
  })
  const searchString = searchParams.toString()

  assert(hash === null || !hash.startsWith('#'))
  const hashString = hash === null ? '' : '#' + hash

  assert(origin === '' || origin.startsWith('http'))
  assert(pathname.startsWith('/'))
  assert(searchString === '' || searchString.startsWith('?'))
  assert(hashString === '' || hashString.startsWith('#'))
  return `${origin}${pathname}${searchString}${hashString}`
}
*
*/
