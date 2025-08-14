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
    return {
      /* TO-DO/soon/once: pass & use previousUrl
      isPageContextJsonRequest: {
        previousUrl: parseSearchVikeArgs(searchVikeArgs),
      },
      */
      isPageContextJsonRequest: true,
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
  return {
    searchVikeArgs,
    urlWithoutPageContextRequestSuffix,
  }
}

function parseSearchVikeArgs(searchVikeArgs: undefined | string) {
  const args = {
    previousUrl: null as null | string,
  }
  if (searchVikeArgs) {
    const parsed = JSON.parse(searchVikeArgs)
    assert(isObject(parsed))
    if ('previousUrl' in parsed) {
      assert(hasProp(parsed, 'previousUrl', 'string'))
      args.previousUrl = parsed.previousUrl
    }
  }
  return args
}
