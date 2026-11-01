export { handlePageContextRequestUrl }

import {
  pageContextJsonFileExtension,
  pageContextJsonFileExtension_errorPage,
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
const pageContextJsonFileExtensionUrls = [
  `/index${pageContextJsonFileExtension}`,
  `/index${pageContextJsonFileExtension_errorPage}`,
]

type UrlParsed = ReturnType<typeof parseUrl>

// See also shared/getPageContextRequestUrl.ts
function handlePageContextRequestUrl(url: string) {
  const urlParsed = parseUrl(url, baseServer)
  const pageContextJsonFileExtensionUrl = getMatch(urlParsed)
  if (!pageContextJsonFileExtensionUrl) {
    return {
      isPageContextJsonRequest: false as const,
      urlWithoutPageContextRequestSuffix: url,
    }
  } else {
    const { urlWithoutPageContextRequestSuffix, searchVikeArgs } = processUrl(
      urlParsed,
      url,
      pageContextJsonFileExtensionUrl,
    )
    const { errorPage } = parseSearchVikeArgs(searchVikeArgs)
    return {
      /* TO-DO/soon/once: pass & use previousUrl
      isPageContextJsonRequest: { previousUrl, errorPage },
      /*/
      isPageContextJsonRequest: { errorPage },
      //*/
      urlWithoutPageContextRequestSuffix,
    }
  }
}

function getMatch(urlParsed: UrlParsed) {
  const { pathnameOriginal, pathname } = urlParsed
  const match = pageContextJsonFileExtensionUrls.find((suffix) => pathname.endsWith(suffix))
  assert(match === pageContextJsonFileExtensionUrls.find((suffix) => pathnameOriginal.endsWith(suffix)))
  return match
}

function processUrl(urlParsed: UrlParsed, url: string, pageContextJsonFileExtensionUrl: string) {
  // We cannot use `urlParsed.pathname` because it would break the `urlParsed.pathnameOriginal` value of subsequent `parseUrl()` calls.
  const { pathnameOriginal, search } = urlParsed
  assert(doNotCreateExtraDirectory === false)
  assert(pathnameOriginal.endsWith(pageContextJsonFileExtensionUrl), { url })
  let pathnameModified = slice(pathnameOriginal, 0, -1 * pageContextJsonFileExtensionUrl.length)
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
    errorPage: null as null | { abortStatusCode?: number; abortReason?: unknown },
  }
  if (searchVikeArgs) {
    const parsed = JSON.parse(searchVikeArgs)
    assert(isObject(parsed))
    if ('previousUrl' in parsed) {
      assert(hasProp(parsed, 'previousUrl', 'string'))
      args.previousUrl = parsed.previousUrl
    }
    // Get the pageContext of the error page
    if ('errorPage' in parsed) {
      assert(isObject(parsed.errorPage))
      const { abortStatusCode, abortReason } = parsed.errorPage
      assert(abortStatusCode === undefined || typeof abortStatusCode === 'number')
      // Usually required by the error page's components (e.g. if the error page's +Page is a React Server Component)
      args.errorPage = { abortReason, abortStatusCode }
    }
  }
  return args
}
