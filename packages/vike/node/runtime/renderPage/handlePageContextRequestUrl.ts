export { handlePageContextRequestUrl }

import { pageContextJsonFileExtension, doNotCreateExtraDirectory } from '../../../shared/getPageContextRequestUrl.js'
import { modifyUrl } from '../../../shared/modifyUrl.js'
import { baseServer, parseUrl, assert, slice, isObject, hasProp } from '../utils.js'

type UrlParsed = ReturnType<typeof parseUrl>

// See also shared/getPageContextRequestUrl.ts
function handlePageContextRequestUrl(url: string) {
  const urlParsed = parseUrl(url, baseServer)
  if (!isMatch(urlParsed)) {
    return {
      isPageContextJsonRequest: false as const,
      urlWithoutPageContextRequestSuffix: url,
    }
  } else {
    const { urlWithoutPageContextRequestSuffix, searchVikeArgs } = processUrl(urlParsed, url)
    const { noCache } = parseSearchVikeArgs(searchVikeArgs)
    return {
      isPageContextJsonRequest: { noCache },
      urlWithoutPageContextRequestSuffix,
    }
  }
}

function isMatch(urlParsed: UrlParsed) {
  const { pathnameOriginal, pathname } = urlParsed
  assert(pathname.endsWith(pageContextJsonFileExtension) === pathnameOriginal.endsWith(pageContextJsonFileExtension))
  return pathname.endsWith(pageContextJsonFileExtension)
}

function processUrl(urlParsed: UrlParsed, url: string) {
  // We cannot use `urlParsed.pathname` because it would break the `urlParsed.pathnameOriginal` value of subsequent `parseUrl()` calls.
  const { pathnameOriginal, search } = urlParsed
  assert(doNotCreateExtraDirectory === false)
  const urlSuffix = `/index${pageContextJsonFileExtension}`
  assert(pathnameOriginal.endsWith(urlSuffix), { url })
  let pathnameModified = slice(pathnameOriginal, 0, -1 * urlSuffix.length)
  if (pathnameModified === '') pathnameModified = '/'
  const searchVikeArgs = search?._vike
  const urlWithoutPageContextRequestSuffix = modifyUrl(url, {
    pathname: pathnameModified,
    search: {
      _vike: searchVikeArgs ? null : undefined,
    },
  })
  console.log('url', url)
  console.log('searchVikeArgs', searchVikeArgs)
  console.log('urlWithoutPageContextRequestSuffix', urlWithoutPageContextRequestSuffix)
  return {
    searchVikeArgs,
    urlWithoutPageContextRequestSuffix,
  }
}

function parseSearchVikeArgs(searchVikeArgs: undefined | string) {
  const args = {
    noCache: false,
  }
  if (searchVikeArgs) {
    const parsed = JSON.parse(searchVikeArgs)
    assert(isObject(parsed))
    if ('noCache' in parsed) {
      assert(hasProp(parsed, 'noCache', 'boolean'))
      args.noCache = parsed.noCache
    }
  }
  return args
}
