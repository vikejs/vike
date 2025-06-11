export { createPageContextServerSide }
export { createPageContextServerSideWithoutGlobalContext }
export type { PageContextCreated }

import { assert, assertUsage, assertWarning, augmentType, normalizeHeaders, objectAssign } from '../utils.js'
import { getPageContextUrlComputed } from '../../../shared/getPageContextUrlComputed.js'
import type { GlobalContextServerInternal } from '../globalContext.js'
import type { PageContextInit } from '../renderPage.js'
import { createPageContextObject, createPageContextShared } from '../../../shared/createPageContextShared.js'

type PageContextCreated = Awaited<ReturnType<typeof createPageContextServerSide>>
async function createPageContextServerSide(
  pageContextInit: PageContextInit,
  globalContext: GlobalContextServerInternal,
  {
    isPrerendering,
    ssr: { urlHandler, isClientSideNavigation } = {
      urlHandler: null,
      isClientSideNavigation: false,
    },
  }:
    | {
        isPrerendering: false
        ssr: {
          urlHandler: null | ((url: string) => string)
          isClientSideNavigation: boolean
        }
      }
    | {
        isPrerendering: true
        ssr?: undefined
      },
) {
  assert(pageContextInit.urlOriginal)

  const pageContextCreated = createPageContext(pageContextInit, isPrerendering)

  objectAssign(pageContextCreated, {
    _globalContext: globalContext,
    _pageFilesAll: globalContext._pageFilesAll, // TODO/v1-release: remove
    // We use pageContext._baseServer and pageContext._baseAssets instead of pageContext._globalContext.baseServer and pageContext._globalContext.baseAssets because the Base URLs can (eventually one day if needed) be made non-global
    _baseServer: globalContext.baseServer,
    _baseAssets: globalContext.baseAssets,
    _pageContextInit: pageContextInit,
    _urlRewrite: null,
    _urlHandler: urlHandler,
    isClientSideNavigation,
  })

  objectAssign(pageContextCreated, globalContext._vikeConfigPublicGlobal)

  // pageContext.urlParsed
  const pageContextUrlComputed = getPageContextUrlComputed(pageContextCreated)
  objectAssign(pageContextCreated, pageContextUrlComputed)

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
      // TODO/next-major-release: remove
      assertWarning(
        false,
        'Setting pageContextInit.headers is deprecated: set pageContextInit.headersOriginal instead, see https://vike.dev/headers',
        { onlyOnce: true },
      )
    } else {
      headers = null
    }
    objectAssign(pageContextCreated, { headers })
  }

  const pageContextAugmented = await createPageContextShared(
    pageContextCreated,
    globalContext._pageConfigGlobal,
    globalContext._vikeConfigPublicGlobal,
  )
  augmentType(pageContextCreated, pageContextAugmented)

  return pageContextCreated
}
function createPageContextServerSideWithoutGlobalContext(pageContextInit: PageContextInit) {
  const pageContext = createPageContext(pageContextInit, false)
  return pageContext
}
function createPageContext(pageContextInit: PageContextInit | null, isPrerendering: boolean) {
  const pageContext = createPageContextObject()
  objectAssign(pageContext, {
    isClientSide: false as const,
    isPrerendering,
  })
  objectAssign(pageContext, pageContextInit)
  return pageContext
}
