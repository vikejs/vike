import { navigationState } from '../navigationState'
import {
  assert,
  assertUsage,
  getFileUrl,
  hasProp,
  isPlainObject,
  objectAssign,
  getProjectError,
  serverSideRouteTo,
} from './utils'
import { parse } from '@brillout/json-s/parse'
import { getPageContextSerializedInHtml } from '../getPageContextSerializedInHtml'
import { PageContextExports, PageFile } from '../../shared/getPageFiles'
import { analyzePageServerSide } from '../../shared/getPageFiles/analyzePageServerSide'
import type { PageContextUrls } from '../../shared/addComputedUrlProps'
import { assertHookResult } from '../../shared/assertHookResult'
import { PageContextForRoute, route } from '../../shared/route'
import { getHook } from '../../shared/getHook'
import { releasePageContext } from '../releasePageContext'
import { loadPageFilesClientSide } from '../loadPageFilesClientSide'
import { disableClientRouting } from './useClientRouter'
import { removeBuiltInOverrides } from './getPageContext/removeBuiltInOverrides'

export { getPageContext }

type PageContextAddendum = {
  _pageId: string
  _pageContextRetrievedFromServer: null | Record<string, unknown>
  isHydration: boolean
  _comesDirectlyFromServer: boolean
  _pageFilesLoaded: PageFile[]
} & PageContextExports

type Result =
  | {
      errorFetchingStaticAssets: true
    }
  | {
      pageContextAddendum: PageContextAddendum
    }

async function getPageContext(
  pageContext: {
    _isFirstRenderAttempt: boolean
  } & PageContextUrls &
    PageContextForRoute,
): Promise<Result> {
  if (pageContext._isFirstRenderAttempt && navigationState.isOriginalUrl(pageContext.url)) {
    return getPageContextFirstRender(pageContext)
  } else {
    return getPageContextUponNavigation(pageContext)
  }
}

async function getPageContextFirstRender(pageContext: {
  _pageFilesAll: PageFile[]
}): Promise<{ pageContextAddendum: PageContextAddendum }> {
  const pageContextAddendum = getPageContextSerializedInHtml()
  removeBuiltInOverrides(pageContextAddendum)

  objectAssign(pageContextAddendum, {
    isHydration: true,
    _comesDirectlyFromServer: true,
  })

  {
    const result = await loadPageFilesClientSide(pageContext._pageFilesAll, pageContextAddendum._pageId)
    if ('errorFetchingStaticAssets' in result) {
      disableClientRouting()
      // This may happen if the frontend was newly deployed during hydration.
      // Ideally: re-try a couple of times by reloading the page (not entirely trivial to implement since `localStorage` is needed.)
      throw result.err
    }
    const { exports, exportsAll, pageExports, pageFilesLoaded } = result.pageContextAddendum
    objectAssign(pageContextAddendum, {
      exports,
      exportsAll,
      pageExports,
      _pageFilesLoaded: pageFilesLoaded,
    })
  }

  return { pageContextAddendum }
}

async function getPageContextUponNavigation(pageContext: PageContextForRoute): Promise<Result> {
  const pageContextAddendum = {
    isHydration: false,
  }
  objectAssign(pageContextAddendum, await getPageContextFromRoute(pageContext))

  {
    const result = await loadPageFilesClientSide(pageContext._pageFilesAll, pageContextAddendum._pageId)
    if ('errorFetchingStaticAssets' in result) {
      disableClientRouting()
      serverSideRouteTo(pageContext.url)
      return { errorFetchingStaticAssets: true }
    }
    const { exports, exportsAll, pageExports, pageFilesLoaded } = result.pageContextAddendum
    objectAssign(pageContextAddendum, {
      exports,
      exportsAll,
      pageExports,
      _pageFilesLoaded: pageFilesLoaded,
    })
  }

  objectAssign(pageContextAddendum, await onBeforeRenderExecute({ ...pageContext, ...pageContextAddendum }))
  assert([true, false].includes(pageContextAddendum._comesDirectlyFromServer))

  return { pageContextAddendum }
}

async function onBeforeRenderExecute(
  pageContext: {
    _pageId: string
    url: string
    isHydration: boolean
    _pageFilesAll: PageFile[]
  } & PageContextExports,
) {
  // `export { onBeforeRender }` defined in `.page.client.js`
  const hook = getHook(pageContext, 'onBeforeRender')
  if (hook) {
    const onBeforeRender = hook.hook
    const pageContextAddendum = {
      _comesDirectlyFromServer: false,
      _pageContextRetrievedFromServer: null,
    }
    const pageContextReadyForRelease = releasePageContext({
      ...pageContext,
      ...pageContextAddendum,
    })
    const hookResult = await onBeforeRender(pageContextReadyForRelease)
    assertHookResult(hookResult, 'onBeforeRender', ['pageContext'], hook.filePath)
    const pageContextFromHook = hookResult?.pageContext
    objectAssign(pageContextAddendum, pageContextFromHook)
    return pageContextAddendum
  }

  // `export { onBeforeRender }` defined in `.page.server.js`
  else if (
    (await analyzePageServerSide(pageContext._pageFilesAll, pageContext._pageId)).hasOnBeforeRenderServerSideOnlyHook
  ) {
    const pageContextFromServer = await retrievePageContextFromServer(pageContext)
    const pageContextAddendum = {}
    Object.assign(pageContextAddendum, pageContextFromServer)
    objectAssign(pageContextAddendum, {
      _comesDirectlyFromServer: true,
      _pageContextRetrievedFromServer: pageContextFromServer,
    })
    return pageContextAddendum
  }

  // No `export { onBeforeRender }` defined
  const pageContextAddendum = { _comesDirectlyFromServer: false, _pageContextRetrievedFromServer: null }
  return pageContextAddendum
}

async function getPageContextFromRoute(
  pageContext: PageContextForRoute,
): Promise<{ _pageId: string; routeParams: Record<string, string> }> {
  const routeResult = await route(pageContext)
  const pageContextFromRoute = routeResult.pageContextAddendum
  if (pageContextFromRoute._pageId === null) {
    setTimeout(() => {
      handle404(pageContext)
    }, 0)
    assertUsage(
      false,
      `[404] Page ${pageContext.url} does not exist. (\`vite-plugin-ssr\` will now server-side route to \`${pageContext.url}\`.)`,
    )
  } else {
    assert(hasProp(pageContextFromRoute, '_pageId', 'string'))
  }
  return pageContextFromRoute
}

function handle404(pageContext: { url: string }) {
  // We let the server show the 404 page; the server will show the 404 URL against the list of routes.
  window.location.pathname = pageContext.url
}

async function retrievePageContextFromServer(pageContext: { url: string }): Promise<Record<string, unknown>> {
  const pageContextUrl = getFileUrl(pageContext.url, '.pageContext.json', true)
  const response = await fetch(pageContextUrl)

  {
    const contentType = response.headers.get('content-type')
    assertUsage(
      contentType && contentType.includes('application/json'),
      `Wrong HTTP Response Header \`content-type\` value for URL ${pageContextUrl} (it should be \`application/json\` but we got \`${contentType}\`). Make sure to use \`pageContext.httpResponse.contentType\`, see https://github.com/brillout/vite-plugin-ssr/issues/191`,
    )
  }

  const responseText = await response.text()
  const responseObject = parse(responseText) as { pageContext: Record<string, unknown> } | { serverSideError: true }
  if ('serverSideError' in responseObject) {
    throw getProjectError(
      '`pageContext` could not be fetched from the server as an error occurred on the server; check your server logs.',
    )
  }

  assert(hasProp(responseObject, 'pageContext'))
  const pageContextFromServer = responseObject.pageContext
  assert(isPlainObject(pageContextFromServer))
  assert(hasProp(pageContextFromServer, '_pageId', 'string'))

  removeBuiltInOverrides(pageContextFromServer)

  return pageContextFromServer
}
