export { resolveHeadersResponseEarly }
export { resolveHeadersResponseFinal }
export { resolveHeadersResponseSetCookie }

import { addCspResponseHeader, PageContextCspNonce } from './csp.js'
import { isCallable } from '../../../utils/isCallable.js'
import { cacheControlDisable, getCacheControl } from './getCacheControl.js'
import type { PageContextAfterPageEntryLoaded } from './loadPageConfigsLazyServerSide.js'
import { getPageContextPublicServer } from './getPageContextPublicServer.js'
import type { PageContextAborted } from '../../../shared-server-client/route/abort.js'
import '../../assertEnvServer.js'

type PageContextHeadersResponse = {
  headersResponse?: Headers
  pageContextsAborted: PageContextAborted[]
}

// Headers of HTML page responses
function resolveHeadersResponseFinal(pageContext: PageContextHeadersResponse, statusCode: number) {
  const headersResponse = pageContext.headersResponse || new Headers()

  // 5xx error pages are temporary and shouldn't be cached.
  // This overrides any previously set Cache-Control value.
  if (statusCode >= 500) headersResponse.set('Cache-Control', cacheControlDisable)

  const headers = getSetCookieAborted(pageContext)
  headersResponse.forEach((value, key) => {
    headers.push([key, value])
  })
  return headers
}

// Headers of `pageContext.json` and redirect responses: only `Set-Cookie` applies to them, the other headers (e.g. `Cache-Control` and `Content-Security-Policy`) are about the HTML page.
function resolveHeadersResponseSetCookie(pageContext: PageContextHeadersResponse) {
  const headersResponse = pageContext.headersResponse || new Headers()
  const headers = getSetCookieAborted(pageContext)
  headersResponse.getSetCookie().forEach((value) => {
    headers.push(['set-cookie', value])
  })
  return headers
}

// Cookies set before `throw redirect()` or `throw render()` are kept. They're sent first, so that a cookie set again later wins.
function getSetCookieAborted(pageContext: PageContextHeadersResponse) {
  return pageContext.pageContextsAborted.flatMap((pageContextAborted) => {
    const { headersResponse } = pageContextAborted as { headersResponse?: Headers }
    return (headersResponse?.getSetCookie() ?? []).map((value): [string, string] => ['set-cookie', value])
  })
}

async function resolveHeadersResponseEarly(pageContext: PageContextAfterPageEntryLoaded & PageContextCspNonce) {
  const headersResponse = await resolveHeadersResponseConfig(pageContext)
  if (!headersResponse.get('Cache-Control')) {
    const cacheControl = getCacheControl(pageContext.pageId, pageContext._globalContext._pageConfigs)
    if (cacheControl) headersResponse.set('Cache-Control', cacheControl)
  }
  addCspResponseHeader(pageContext, headersResponse)
  const pageContextAddendum = {
    headersResponse,
  }
  return pageContextAddendum
}

async function resolveHeadersResponseConfig(pageContext: PageContextAfterPageEntryLoaded): Promise<Headers> {
  const headersMerged = new Headers()
  await Promise.all(
    (pageContext.config.headersResponse ?? []).map(
      async (headers: HeadersInit | ((arg0: any) => HeadersInit | PromiseLike<HeadersInit>)) => {
        let headersInit: HeadersInit
        if (isCallable(headers)) {
          headersInit = await headers(getPageContextPublicServer(pageContext))
        } else {
          headersInit = headers
        }
        new Headers(headersInit).forEach((value, key) => {
          headersMerged.append(key, value)
        })
      },
    ),
  )
  return headersMerged
}
