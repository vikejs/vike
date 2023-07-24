export { getPageContext }
export { getPageContextErrorPage }
export { checkIf404 }

import { navigationState } from '../navigationState'
import {
  assert,
  assertUsage,
  hasProp,
  isPlainObject,
  objectAssign,
  getProjectError,
  serverSideRouteTo,
  executeHook,
  isObject
} from './utils'
import { parse } from '@brillout/json-serializer/parse'
import { getPageContextSerializedInHtml } from '../getPageContextSerializedInHtml'
import type { PageContextExports, PageFile } from '../../shared/getPageFiles'
import { analyzePageServerSide } from '../../shared/getPageFiles/analyzePageServerSide'
import type { PageContextUrlsPrivate } from '../../shared/addComputedUrlProps'
import { PageContextForRoute, route } from '../../shared/route'
import { getErrorPageId } from '../../shared/error-page'
import { getHook } from '../../shared/getHook'
import { preparePageContextForUserConsumptionClientSide } from '../preparePageContextForUserConsumptionClientSide'
import { loadPageFilesClientSide } from '../loadPageFilesClientSide'
import { removeBuiltInOverrides } from './getPageContext/removeBuiltInOverrides'
import { getPageContextRequestUrl } from '../../shared/getPageContextRequestUrl'
import type { PageConfig } from '../../shared/page-configs/PageConfig'
import { getConfigValue, getPageConfig } from '../../shared/page-configs/utils'
import { assertOnBeforeRenderHookReturn } from '../../shared/assertOnBeforeRenderHookReturn'
import { executeGuardHook } from '../../shared/route/executeGuardHook'
import { render } from '../../shared/abort'

type PageContextAddendum = {
  _pageId: string
  isHydration: boolean
  _hasPageContextFromServer: boolean
  _pageFilesLoaded: PageFile[]
} & PageContextExports

type PageContextPrevious = null | { _hasAdditionalPageContextInit?: true }

type PageContextPassThrough = PageContextUrlsPrivate &
  PageContextForRoute & {
    isBackwardNavigation: boolean | null
  }

async function getPageContext(
  pageContext: {
    _isFirstRenderAttempt: boolean
  } & PageContextPassThrough,
  pageContextPrevious: PageContextPrevious
): Promise<PageContextAddendum> {
  if (pageContext._isFirstRenderAttempt && navigationState.isFirstUrl(pageContext.urlOriginal)) {
    assert(hasProp(pageContext, '_isFirstRenderAttempt', 'true'))
    return getPageContextFirstRender(pageContext)
  } else {
    assert(hasProp(pageContext, '_isFirstRenderAttempt', 'false'))
    return getPageContextUponNavigation(pageContext, pageContextPrevious)
  }
}

async function getPageContextFirstRender(pageContext: {
  _pageFilesAll: PageFile[]
  _pageConfigs: PageConfig[]
  _isFirstRenderAttempt: true
  urlOriginal: string
}): Promise<PageContextAddendum> {
  const pageContextAddendum = getPageContextSerializedInHtml()
  removeBuiltInOverrides(pageContextAddendum)

  objectAssign(pageContextAddendum, {
    isHydration: true,
    _hasPageContextFromServer: true
  })

  objectAssign(
    pageContextAddendum,
    await loadPageFilesClientSide(pageContext._pageFilesAll, pageContext._pageConfigs, pageContextAddendum._pageId)
  )

  return pageContextAddendum
}

async function getPageContextErrorPage(pageContext: {
  urlOriginal: string
  _allPageIds: string[]
  _isFirstRenderAttempt: boolean
  _pageFilesAll: PageFile[]
  _pageConfigs: PageConfig[]
}): Promise<PageContextAddendum> {
  const errorPageId = getErrorPageId(pageContext._pageFilesAll, pageContext._pageConfigs)
  if (!errorPageId) {
    throw new Error('No error page')
  }
  const pageContextAddendum = {
    isHydration: false,
    _pageId: errorPageId,
    _hasPageContextFromServer: false
  }

  objectAssign(
    pageContextAddendum,
    await loadPageFilesClientSide(pageContext._pageFilesAll, pageContext._pageConfigs, pageContextAddendum._pageId)
  )

  return pageContextAddendum
}

async function getPageContextUponNavigation(
  pageContext: { _isFirstRenderAttempt: false } & PageContextPassThrough,
  pageContextPrevious: PageContextPrevious
): Promise<PageContextAddendum> {
  let pageContextAddendum = {}
  objectAssign(pageContextAddendum, {
    isHydration: false
  })
  objectAssign(pageContextAddendum, await getPageContextFromRoute(pageContext))

  objectAssign(
    pageContextAddendum,
    await loadPageFilesClientSide(pageContext._pageFilesAll, pageContext._pageConfigs, pageContextAddendum._pageId)
  )

  await executeGuardHook(
    {
      _hasPageContextFromServer: false,
      ...pageContext,
      ...pageContextAddendum
    },
    (pageContext) => preparePageContextForUserConsumptionClientSide(pageContext, true)
  )

  if (await hasPageContextServerOnly({ ...pageContext, ...pageContextAddendum }, pageContextPrevious)) {
    objectAssign(pageContextAddendum, { _hasPageContextFromServer: true })
    const pageContextFromServer = await retreievePageContextFromServer(pageContext)
    if (!pageContextFromServer['_isError']) {
      objectAssign(pageContextAddendum, pageContextFromServer)
    } else {
      const errorPageId = getErrorPageId(pageContext._pageFilesAll, pageContext._pageConfigs)
      assert(errorPageId)
      pageContextAddendum = {}
      objectAssign(pageContextAddendum, {
        isHydration: false,
        _pageId: errorPageId,
        _hasPageContextFromServer: true
      })

      objectAssign(
        pageContextAddendum,
        await loadPageFilesClientSide(pageContext._pageFilesAll, pageContext._pageConfigs, pageContextAddendum._pageId)
      )

      assert(pageContextFromServer._hasPageContextFromServer === true)
      assert(hasProp(pageContextFromServer, 'is404', 'boolean'))
      assert(hasProp(pageContextFromServer, 'pageProps', 'object'))
      assert(hasProp(pageContextFromServer.pageProps, 'is404', 'boolean'))
      // When the user hasn't define a `_error.page.js` file: the mechanism with `serverSideError: true` is used instead
      assert(!('serverSideError' in pageContextFromServer))
      objectAssign(pageContextAddendum, pageContextFromServer)
    }
  } else {
    objectAssign(pageContextAddendum, { _hasPageContextFromServer: false })
  }

  {
    const pageContextFromHook = await executeOnBeforeRenderHookClientSide({ ...pageContext, ...pageContextAddendum })
    Object.assign(pageContextAddendum, pageContextFromHook)
  }

  return pageContextAddendum
}

async function executeOnBeforeRenderHookClientSide(
  pageContext: {
    _pageId: string
    urlOriginal: string
    isHydration: boolean
    _pageFilesAll: PageFile[]
    _pageConfigs: PageConfig[]
  } & PageContextExports &
    PageContextPassThrough
): Promise<null | Record<string, unknown>> {
  const hook = getHook(pageContext, 'onBeforeRender')
  if (!hook) return null
  const onBeforeRender = hook.hookFn
  const pageContextAddendum = {
    _hasPageContextFromServer: false
  }
  const pageContextForUserConsumption = preparePageContextForUserConsumptionClientSide(
    {
      ...pageContext,
      ...pageContextAddendum
    },
    true
  )
  const hookResult = await executeHook(
    () => onBeforeRender(pageContextForUserConsumption),
    'onBeforeRender',
    hook.hookFilePath
  )
  assertOnBeforeRenderHookReturn(hookResult, hook.hookFilePath)
  const pageContextFromHook = hookResult?.pageContext
  objectAssign(pageContextAddendum, pageContextFromHook)
  return pageContextAddendum
}

async function hasPageContextServerOnly(
  pageContext: Parameters<typeof onBeforeRenderServerOnlyExists>[0],
  pageContextPrevious: PageContextPrevious
): Promise<boolean> {
  if (pageContextPrevious?._hasAdditionalPageContextInit) {
    return true
  }
  if (await onBeforeRenderServerOnlyExists(pageContext)) {
    return true
  }
  return false
}

async function onBeforeRenderServerOnlyExists(
  pageContext: {
    _pageId: string
    urlOriginal: string
    isHydration: boolean
    _pageFilesAll: PageFile[]
    _pageConfigs: PageConfig[]
  } & PageContextExports &
    PageContextPassThrough
): Promise<boolean> {
  if (pageContext._pageConfigs.length > 0) {
    // V1
    const pageConfig = getPageConfig(pageContext._pageId, pageContext._pageConfigs)
    return getConfigValue(pageConfig, 'hasServerOnBeforeRender', 'boolean') ?? false
  } else {
    // TODO/v1-release: remove
    // V0.4
    const { hasOnBeforeRenderServerSideOnlyHook } = await analyzePageServerSide(
      pageContext._pageFilesAll,
      pageContext._pageId
    )
    return hasOnBeforeRenderServerSideOnlyHook
  }
}

async function getPageContextFromRoute(
  pageContext: PageContextForRoute
): Promise<{ _pageId: string; routeParams: Record<string, string> }> {
  const routeResult = await route(pageContext)
  const pageContextFromRoute = routeResult.pageContextAddendum
  if (!pageContextFromRoute._pageId) {
    const err = new Error('No routing match')
    markIs404(err)
    throw err
  }
  assert(hasProp(pageContextFromRoute, '_pageId', 'string'))
  return pageContextFromRoute
}

function markIs404(err: Error) {
  objectAssign(err, { _is404: true })
}
function checkIf404(err: unknown): boolean {
  return isObject(err) && err._is404 === true
}

async function retreievePageContextFromServer(pageContext: Parameters<typeof fetchPageContextFromServer>[0]) {
  const pageContextFromServer = await fetchPageContextFromServer(pageContext)
  {
    const urlRewrite = pageContextFromServer._urlRewrite
    if (urlRewrite) {
      assert(typeof urlRewrite === 'string')
      assert(urlRewrite.startsWith('/'))
      throw render(urlRewrite as `/${string}`, pageContextFromServer)
    }
  }
  return pageContextFromServer
}
async function fetchPageContextFromServer(pageContext: {
  urlOriginal: string
  _urlRewrite: string | null
  _urlOriginalPristine?: string
}): Promise<Record<string, unknown>> {
  const urlLogical = pageContext._urlRewrite ?? pageContext._urlOriginalPristine ?? pageContext.urlOriginal
  const pageContextUrl = getPageContextRequestUrl(urlLogical)
  const response = await fetch(pageContextUrl)

  {
    const contentType = response.headers.get('content-type')
    const contentTypeCorrect = 'application/json'
    const isCorrect = contentType && contentType.includes(contentTypeCorrect)

    // Static hosts + page doesn't exist
    if (!isCorrect && response.status === 404) {
      serverSideRouteTo(pageContext.urlOriginal)
      const err = new Error("Page doesn't exist")
      Object.assign(err, { _abortRendering: true })
      throw err
    }

    assertUsage(
      isCorrect,
      `Wrong Content-Type for ${pageContextUrl}: it should be ${contentTypeCorrect} but it's ${contentType} instead. Make sure to properly use pageContext.httpResponse.headers, see https://vite-plugin-ssr.com/renderPage`
    )
  }

  const responseText = await response.text()
  const pageContextFromServer = parse(responseText) as
    | { pageContext: Record<string, unknown> }
    | { serverSideError: true }
  if ('serverSideError' in pageContextFromServer) {
    throw getProjectError(
      '`pageContext` could not be fetched from the server as an error occurred on the server; check your server logs.'
    )
  }
  assert(isPlainObject(pageContextFromServer))
  assert(hasProp(pageContextFromServer, '_pageId', 'string'))

  removeBuiltInOverrides(pageContextFromServer)

  return pageContextFromServer
}
