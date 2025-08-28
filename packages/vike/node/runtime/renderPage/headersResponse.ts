export { resolveHeadersResponse }

import { addCspResponseHeader, PageContextCspNonce } from '../csp.js'
import { isCallable } from '../utils.js'
import { getCacheControl } from './getCacheControl.js'
import type { PageContextAfterPageEntryLoaded } from './loadPageConfigsLazyServerSide.js'

async function resolveHeadersResponse(
  pageContext: PageContextAfterPageEntryLoaded & PageContextCspNonce,
): Promise<Headers> {
  const headersResponse = await mergeHeaders(pageContext)
  if (!headersResponse.get('Cache-Control')) {
    const cacheControl = getCacheControl(pageContext.pageId, pageContext._globalContext._pageConfigs)
    if (cacheControl) headersResponse.set('Cache-Control', cacheControl)
  }
  addCspResponseHeader(pageContext, headersResponse)
  return headersResponse
}

async function mergeHeaders(pageContext: PageContextAfterPageEntryLoaded): Promise<Headers> {
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
