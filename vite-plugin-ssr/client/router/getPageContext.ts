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
import type { PageContextUrls } from '../../shared/addComputedUrlProps'
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
import { renderUrl } from '../../shared/abort'

type PageContextAddendum = {
  _pageId: string
  _pageContextRetrievedFromServer: null | Record<string, unknown>
  isHydration: boolean
  _comesDirectlyFromServer: boolean
  _pageFilesLoaded: PageFile[]
} & PageContextExports

type PageContextPassThrough = PageContextUrls &
  PageContextForRoute & {
    isBackwardNavigation: boolean | null
  }

async function getPageContext(
  pageContext: {
    _isFirstRenderAttempt: boolean
  } & PageContextPassThrough
): Promise<PageContextAddendum> {
  if (pageContext._isFirstRenderAttempt && navigationState.isFirstUrl(pageContext.urlOriginal)) {
    assert(hasProp(pageContext, '_isFirstRenderAttempt', 'true'))
    return getPageContextFirstRender(pageContext)
  } else {
    assert(hasProp(pageContext, '_isFirstRenderAttempt', 'false'))
    return getPageContextUponNavigation(pageContext)
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
    _comesDirectlyFromServer: true
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
    _pageContextRetrievedFromServer: null,
    _comesDirectlyFromServer: false
  }

  objectAssign(
    pageContextAddendum,
    await loadPageFilesClientSide(pageContext._pageFilesAll, pageContext._pageConfigs, pageContextAddendum._pageId)
  )

  return pageContextAddendum
}

async function getPageContextUponNavigation(
  pageContext: { _isFirstRenderAttempt: false } & PageContextPassThrough
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
      _comesDirectlyFromServer: false,
      _pageContextRetrievedFromServer: null,
      ...pageContext,
      ...pageContextAddendum
    },
    (pageContext) => preparePageContextForUserConsumptionClientSide(pageContext, true)
  )

  const pageContextFromHook = await executeOnBeforeRenderHook({ ...pageContext, ...pageContextAddendum })
  assert([true, false].includes(pageContextFromHook._comesDirectlyFromServer))
  if (!pageContextFromHook['_isError']) {
    objectAssign(pageContextAddendum, pageContextFromHook)
    return pageContextAddendum
  } else {
    pageContextAddendum = {}

    assert(pageContextFromHook._comesDirectlyFromServer === true)
    assert(hasProp(pageContextFromHook, 'is404', 'boolean'))
    assert(hasProp(pageContextFromHook, 'pageProps', 'object'))
    assert(hasProp(pageContextFromHook.pageProps, 'is404', 'boolean'))
    // When the user hasn't define a `_error.page.js` file: the mechanism with `serverSideError: true` is used instead
    assert(!('serverSideError' in pageContextFromHook))
    const errorPageId = getErrorPageId(pageContext._pageFilesAll, pageContext._pageConfigs)
    assert(errorPageId)

    objectAssign(pageContextAddendum, {
      isHydration: false,
      _pageId: errorPageId
    })
    objectAssign(pageContextAddendum, pageContextFromHook)
    objectAssign(
      pageContextAddendum,
      await loadPageFilesClientSide(pageContext._pageFilesAll, pageContext._pageConfigs, pageContextAddendum._pageId)
    )
    return pageContextAddendum
  }
}

async function executeOnBeforeRenderHook(
  pageContext: {
    _pageId: string
    urlOriginal: string
    isHydration: boolean
    _pageFilesAll: PageFile[]
    _pageConfigs: PageConfig[]
  } & PageContextExports &
    PageContextPassThrough
): Promise<
  { _comesDirectlyFromServer: boolean; _pageContextRetrievedFromServer: null | Record<string, unknown> } & Record<
    string,
    unknown
  >
> {
  // `export { onBeforeRender }` defined in `.page.client.js` or `.page.js`
  const hook = getHook(pageContext, 'onBeforeRender')
  if (hook) {
    const onBeforeRender = hook.hookFn
    const pageContextAddendum = {
      _comesDirectlyFromServer: false,
      _pageContextRetrievedFromServer: null
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

  // `export { onBeforeRender }` defined in `.page.server.js`
  if (await onBeforeRenderServerSideExists(pageContext)) {
    const pageContextFromServer = await retrievePageContextFromServer(pageContext)
    {
      const { urlRewrite } = pageContextFromServer
      if (urlRewrite) {
        assert(typeof urlRewrite === 'string')
        throw renderUrl(urlRewrite, pageContextFromServer)
      }
    }
    const pageContextAddendum = {}
    Object.assign(pageContextAddendum, pageContextFromServer)
    objectAssign(pageContextAddendum, {
      _comesDirectlyFromServer: true,
      _pageContextRetrievedFromServer: pageContextFromServer
    })
    return pageContextAddendum
  }

  // No `export { onBeforeRender }` defined
  const pageContextAddendum = { _comesDirectlyFromServer: false, _pageContextRetrievedFromServer: null }
  return pageContextAddendum
}

async function onBeforeRenderServerSideExists(
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

async function retrievePageContextFromServer(pageContext: {
  urlOriginal: string
  urlRewrite: string | null
  _urlOriginalPristine?: string
}): Promise<Record<string, unknown>> {
  const urlLogical = pageContext.urlRewrite ?? pageContext._urlOriginalPristine ?? pageContext.urlOriginal
  const pageContextUrl = getPageContextRequestUrl(urlLogical)
  const response = await fetch(pageContextUrl)

  {
    const contentType = response.headers.get('content-type')
    const isRightContentType = contentType && contentType.includes('application/json')

    // Static hosts + page doesn't exist
    if (!isRightContentType && response.status === 404) {
      serverSideRouteTo(pageContext.urlOriginal)
      const err = new Error("Page doesn't exist")
      Object.assign(err, { _abortRendering: true })
      throw err
    }

    assertUsage(
      isRightContentType,
      `Wrong HTTP Response Header \`content-type\` value for URL ${pageContextUrl} (it should be \`application/json\` but we got \`${contentType}\`). Make sure to use \`pageContext.httpResponse.contentType\`, see https://github.com/brillout/vite-plugin-ssr/issues/191`
    )
  }

  const responseText = await response.text()
  const responseObject = parse(responseText) as { pageContext: Record<string, unknown> } | { serverSideError: true }
  if ('serverSideError' in responseObject) {
    throw getProjectError(
      '`pageContext` could not be fetched from the server as an error occurred on the server; check your server logs.'
    )
  }

  assert(hasProp(responseObject, 'pageContext'))
  const pageContextFromServer = responseObject.pageContext
  assert(isPlainObject(pageContextFromServer))
  assert(hasProp(pageContextFromServer, '_pageId', 'string'))

  removeBuiltInOverrides(pageContextFromServer)

  return pageContextFromServer
}
