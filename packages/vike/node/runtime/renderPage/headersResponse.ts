export { resolveHeadersResponseEarly }
export { resolveHeadersResponseFinal }

import { addCspResponseHeader, PageContextCspNonce } from '../csp.js'
import { isCallable } from '../utils.js'
import { cacheControlDisable, getCacheControl } from './getCacheControl.js'
import type { PageContextAfterPageEntryLoaded } from './loadPageConfigsLazyServerSide.js'

function resolveHeadersResponseFinal(
  pageContext: {
    headersResponse?: Headers
  },
  statusCode: number,
) {
  const headers: [string, string][] = []
  const headersResponse = pageContext.headersResponse || new Headers()
  headersResponse.forEach((value, key) => {
    headers.push([key, value])
  })
  // TODO/now fix
  // 5xx error pages are temporary and shouldn't be cached.
  // This overrides any previously set Cache-Control value.
  if (statusCode >= 500) headersResponse.set('Cache-Control', cacheControlDisable)
  return headers
}

async function resolveHeadersResponseEarly(
  pageContext: PageContextAfterPageEntryLoaded & PageContextCspNonce,
): Promise<Headers> {
  const headersResponse = await resolveHeadersResponseConfig(pageContext)
  if (!headersResponse.get('Cache-Control')) {
    const cacheControl = getCacheControl(pageContext.pageId, pageContext._globalContext._pageConfigs)
    if (cacheControl) headersResponse.set('Cache-Control', cacheControl)
  }
  addCspResponseHeader(pageContext, headersResponse)
  return headersResponse
}

async function resolveHeadersResponseConfig(pageContext: PageContextAfterPageEntryLoaded): Promise<Headers> {
  const headersMerged = new Headers()
  await Promise.all(
    (pageContext.config.headersResponse ?? []).map(
      async (headers: HeadersInit | ((arg0: any) => HeadersInit | PromiseLike<HeadersInit>)) => {
        let headersInit: HeadersInit
        if (isCallable(headers)) {
          headersInit = await headers(pageContext as any)
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
