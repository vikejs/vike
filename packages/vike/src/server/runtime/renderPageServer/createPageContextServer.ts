export { createPageContextServer }
export { createPageContextServerWithoutGlobalContext }
export type { PageContextCreatedServer }
export type { PageContextCreatedServerWithoutGlobalContext }

import { assert, assertUsage, assertWarning, updateType, normalizeHeaders, objectAssign } from '../../utils.js'
import { getPageContextUrlComputed } from '../../../shared-server-client/getPageContextUrlComputed.js'
import type { GlobalContextServerInternal } from '../globalContext.js'
import type { PageContextInit } from '../renderPageServer.js'
import {
  createPageContextObject,
  createPageContextShared,
} from '../../../shared-server-client/createPageContextShared.js'

type PageContextCreatedServerWithoutGlobalContext = ReturnType<typeof createPageContextServerWithoutGlobalContext>
type PageContextCreatedServer = Awaited<ReturnType<typeof createPageContextServer>>
function createPageContextServer(
  pageContextInit: PageContextInit,
  globalContext: GlobalContextServerInternal,
  args: {
    requestId: number
  } & (
    | {
        isPrerendering: true
      }
    | {
        isPrerendering: false
        urlHandler: null | ((url: string) => string)
        isClientSideNavigation: boolean
      }
  ),
) {
  assert(pageContextInit.urlOriginal)
  const pageContext = createPageContextBase(pageContextInit, args.isPrerendering, args.requestId)

  objectAssign(pageContext, {
    _globalContext: globalContext,
    _pageFilesAll: globalContext._pageFilesAll, // TO-DO/next-major-release: remove
    // We use pageContext._baseServer and pageContext._baseAssets instead of pageContext._globalContext.baseServer and pageContext._globalContext.baseAssets because the Base URLs can (eventually one day if needed) be made non-global
    _baseServer: globalContext.baseServer,
    _baseAssets: globalContext.baseAssets,
    _pageContextInit: pageContextInit,
    _urlHandler: args.isPrerendering ? null : args.urlHandler,
    isClientSideNavigation: args.isPrerendering ? false : args.isClientSideNavigation,
  })

  objectAssign(pageContext, globalContext._globalConfigPublic)

  // pageContext.urlParsed
  const pageContextUrlComputed = getPageContextUrlComputed(pageContext)
  objectAssign(pageContext, pageContextUrlComputed)

  // pageContext.headers
  {
    let headers: null | Record<string, string>
    if (pageContextInit.headersOriginal) {
      headers = normalizeHeaders(pageContextInit.headersOriginal)
      assertUsage(
        !('headers' in pageContextInit),
        "You're defining pageContextInit.headersOriginal as well as pageContextInit.headers but you should only define pageContextInit.headersOriginal instead, see https://vike.dev/headers",
      )
    } else if (pageContextInit.headers) {
      headers = pageContextInit.headers as Record<string, string>
      // TO-DO/next-major-release: remove
      assertWarning(
        false,
        'Setting pageContextInit.headers is deprecated: set pageContextInit.headersOriginal instead, see https://vike.dev/headers',
        { onlyOnce: true },
      )
    } else {
      headers = null
    }
    objectAssign(pageContext, { headers })
  }

  const pageContextAugmented = createPageContextShared(pageContext, globalContext._globalConfigPublic)
  updateType(pageContext, pageContextAugmented)

  return pageContext
}

/** Use this as last resort — prefer passing richer `pageContext` objects to the runtime logger */
function createPageContextServerWithoutGlobalContext(pageContextInit: PageContextInit, requestId: number) {
  const pageContext = createPageContextBase(pageContextInit, false, requestId)
  return pageContext
}

function createPageContextBase(pageContextInit: PageContextInit | null, isPrerendering: boolean, requestId: number) {
  const pageContext = createPageContextObject()
  objectAssign(pageContext, {
    isClientSide: false as const,
    isPrerendering,
    _requestId: requestId,
  })
  objectAssign(pageContext, pageContextInit)
  return pageContext
}
