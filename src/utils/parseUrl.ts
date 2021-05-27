import { assert } from '../utils'

export { getUrlFull }
export { getUrlPathname }
export { getUrlParsed }
export { getUrlParts }
export { getUrlFullWithoutHash }

/**
 Returns `${pathname}${search}${hash}`. (Basically removes the origin.)
*/
function getUrlFull(url?: string): string { // TODO
  url = retrieveUrl(url)
  const { origin } = parseWithNewUrl(url)
  assert(url.startsWith(origin), { url })
  const urlFull = url.slice(origin.length)
  assert(`${origin}${urlFull}` === url, { url })
  assert(urlFull.startsWith('/'), { url })
  return urlFull
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

function getUrlParts(url?: string): { origin: string; pathname: string; searchString: string; hashString: string } {
  url = retrieveUrl(url)

  const [urlWithoutHash, ...hashList] = url.split('#')
  const hashString = ['', ...hashList].join('#')

  const [urlWithoutSearch, ...searchList] = urlWithoutHash.split('?')
  const searchString = ['', ...searchList].join('?')

  const { origin, pathname: pathnameFromNewUrl } = parseWithNewUrl(urlWithoutSearch)
  assert(url.startsWith(origin), { url })
  const pathname = urlWithoutSearch.slice(origin.length)
  assert(pathname === pathnameFromNewUrl, { url })

  const urlRecreated = `${origin}${pathname}${searchString}${hashString}`
  assert(url === urlRecreated, { urlRecreated, url })
  return { origin, pathname, searchString, hashString }
}

function getUrlParsed(
  url?: string
): { origin: string; pathname: string; search: null | Record<string, string>; hash: null | string } {
  url = retrieveUrl(url)

  const { origin, pathname, searchString, hashString } = getUrlParts(url)

  assert(searchString === '' || searchString.startsWith('?'))
  const search = searchString === '' ? null : Object.fromEntries([...new URLSearchParams(searchString)])

  assert(hashString === '' || hashString.startsWith('#'))
  const hash = hashString === '' ? null : decodeURIComponent(hashString.slice(1))

  assert(pathname.startsWith('/'))
  assert(url.startsWith(`${origin}${pathname}`))
  return { origin, pathname, search, hash }
}

function getUrlFullWithoutHash(url?: string): string {
  const urlFull = getUrlFull(url)
  const urlFullWithoutHash = urlFull.split('#')[0]
  return urlFullWithoutHash
}

function retrieveUrl(url: undefined | string) {
  if (!url) {
    url = window.location.href
  }
  return url
}

function parseWithNewUrl(url: string) {
  try {
    const { origin, pathname } = new URL(url)
    return { origin, pathname }
  } catch (err) {
    assert(url.startsWith('/'), { url })
    const { pathname } = new URL('https://fake-origin.example.org' + url)
    return { origin: '', pathname }
  }
}
