export { handlePageContextRequestUrl }

import {
  pageContextJsonFileExtension,
  pageContextJsonFileExtension_server,
  doNotCreateExtraDirectory,
} from '../../../shared-server-client/getPageContextRequestUrl.js'
import { modifyUrlSameOrigin } from '../../../shared-server-client/modifyUrlSameOrigin.js'
import { slice } from '../../../utils/slice.js'
import { baseServer } from '../../../utils/urlToFile.js'
import { assert } from '../../../utils/assert.js'
import { hasProp } from '../../../utils/hasProp.js'
import { isObject } from '../../../utils/isObject.js'
import { parseUrl } from '../../../utils/parseUrl.js'
import '../../assertEnvServer.js'
const pageContextJsonUrls = [
  `/index${pageContextJsonFileExtension_server}`,
  `/index${pageContextJsonFileExtension}`,
] as const

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
    const { errorPageInfo } = parseSearchVikeArgs(searchVikeArgs)
    return {
      /* TO-DO/soon/once: pass & use previousUrl
      isPageContextJsonRequest: { previousUrl, errorPageInfo },
      /*/
      isPageContextJsonRequest: errorPageInfo === null ? (true as const) : { errorPageInfo },
      //*/
      urlWithoutPageContextRequestSuffix,
    }
  }
}

function isMatch(urlParsed: UrlParsed): boolean {
  const { pathnameOriginal, pathname } = urlParsed
  assert(!!getMatch(pathname) === !!getMatch(pathnameOriginal))
  return !!getMatch(pathname)
}

function getMatch(pathname: string) {
  return pageContextJsonUrls.find((fileExtensionUrl) => pathname.endsWith(fileExtensionUrl))
}

function processUrl(urlParsed: UrlParsed, url: string) {
  // We cannot use `urlParsed.pathname` because it would break the `urlParsed.pathnameOriginal` value of subsequent `parseUrl()` calls.
  const { pathnameOriginal, search } = urlParsed
  assert(doNotCreateExtraDirectory === false)
  const fileUrl = getMatch(pathnameOriginal)
  assert(fileUrl, { url })
  let pathnameModified = slice(pathnameOriginal, 0, -1 * fileUrl.length)
  if (pathnameModified === '') pathnameModified = '/'
  const searchVikeArgs = search?._vike
  const urlWithoutPageContextRequestSuffix = modifyUrlSameOrigin(url, {
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
    errorPageInfo: null as null | { abortStatusCode?: number; abortReason?: unknown },
  }
  if (searchVikeArgs) {
    const parsed = JSON.parse(searchVikeArgs)
    assert(isObject(parsed))
    if ('previousUrl' in parsed) {
      assert(hasProp(parsed, 'previousUrl', 'string'))
      args.previousUrl = parsed.previousUrl
    }
    // Get the pageContext of the error page
    if ('errorPageInfo' in parsed) {
      assert(isObject(parsed.errorPageInfo))
      const { abortStatusCode, abortReason } = parsed.errorPageInfo
      assert(abortStatusCode === undefined || typeof abortStatusCode === 'number')
      // Usually required by the error page's components (e.g. if the error page's +Page is a React Server Component)
      args.errorPageInfo = { abortReason, abortStatusCode }
    }
  }
  return args
}
