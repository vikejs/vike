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
  callHookWithTimeout,
  isObject
} from './utils'
import { parse } from '@brillout/json-serializer/parse'
import { getPageContextSerializedInHtml } from '../getPageContextSerializedInHtml'
import type { PageContextExports, PageFile } from '../../shared/getPageFiles'
import { analyzePageServerSide } from '../../shared/getPageFiles/analyzePageServerSide'
import type { PageContextUrls } from '../../shared/addComputedUrlProps'
import { assertHookResult } from '../../shared/assertHookResult'
import { PageContextForRoute, route } from '../../shared/route'
import { getErrorPageId } from '../../shared/error-page'
import { getHook } from '../../shared/getHook'
import { releasePageContext } from '../releasePageContext'
import { loadPageFilesClientSide } from '../loadPageFilesClientSide'
import { removeBuiltInOverrides } from './getPageContext/removeBuiltInOverrides'
import { getPageContextRequestUrl } from '../../shared/getPageContextRequestUrl'
import type { PlusConfig } from '../../shared/page-configs/PlusConfig'
import { getCodeFilePath, getPlusConfig } from '../../shared/page-configs/utils'

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
  _plusConfigs: PlusConfig[]
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
    await loadPageFilesClientSide(pageContext._pageFilesAll, pageContext._plusConfigs, pageContextAddendum._pageId)
  )

  return pageContextAddendum
}

async function getPageContextErrorPage(pageContext: {
  urlOriginal: string
  _allPageIds: string[]
  _isFirstRenderAttempt: boolean
  _pageFilesAll: PageFile[]
  _plusConfigs: PlusConfig[]
}): Promise<PageContextAddendum> {
  const errorPageId = getErrorPageId(pageContext._pageFilesAll, pageContext._plusConfigs)
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
    await loadPageFilesClientSide(pageContext._pageFilesAll, pageContext._plusConfigs, pageContextAddendum._pageId)
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
    await loadPageFilesClientSide(pageContext._pageFilesAll, pageContext._plusConfigs, pageContextAddendum._pageId)
  )

  const pageContextFromHook = await onBeforeRenderExecute({ ...pageContext, ...pageContextAddendum })
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
    const errorPageId = getErrorPageId(pageContext._pageFilesAll, pageContext._plusConfigs)
    assert(errorPageId)

    objectAssign(pageContextAddendum, {
      isHydration: false,
      _pageId: errorPageId
    })
    objectAssign(pageContextAddendum, pageContextFromHook)
    objectAssign(
      pageContextAddendum,
      await loadPageFilesClientSide(pageContext._pageFilesAll, pageContext._plusConfigs, pageContextAddendum._pageId)
    )
    return pageContextAddendum
  }
}

async function onBeforeRenderExecute(
  pageContext: {
    _pageId: string
    urlOriginal: string
    isHydration: boolean
    _pageFilesAll: PageFile[]
    _plusConfigs: PlusConfig[]
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
    const onBeforeRender = hook.hook
    const pageContextAddendum = {
      _comesDirectlyFromServer: false,
      _pageContextRetrievedFromServer: null
    }
    const pageContextReadyForRelease = releasePageContext(
      {
        ...pageContext,
        ...pageContextAddendum
      },
      true
    )
    const hookResult = await callHookWithTimeout(
      () => onBeforeRender(pageContextReadyForRelease),
      'onBeforeRender',
      hook.hookSrc
    )
    assertHookResult(hookResult, 'onBeforeRender', ['pageContext'], hook.hookSrc)
    const pageContextFromHook = hookResult?.pageContext
    objectAssign(pageContextAddendum, pageContextFromHook)
    return pageContextAddendum
  }

  // `export { onBeforeRender }` defined in `.page.server.js`
  if (await onBeforeRenderServerSideExists(pageContext)) {
    const pageContextFromServer = await retrievePageContextFromServer(pageContext)
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
    _plusConfigs: PlusConfig[]
  } & PageContextExports &
    PageContextPassThrough
): Promise<boolean> {
  if (pageContext._plusConfigs.length > 0) {
    const plusConfig = getPlusConfig(pageContext._pageId, pageContext._plusConfigs)
    return (
      !!getCodeFilePath(plusConfig, 'onBeforeRender') &&
      plusConfig.configElements.onBeforeRender!.configEnv === 'server-only'
    )
  } else {
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
  _urlPristine?: string
}): Promise<Record<string, unknown>> {
  const pageContextUrl = getPageContextRequestUrl(pageContext._urlPristine ?? pageContext.urlOriginal)
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
