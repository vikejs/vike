import { navigationState } from '../navigationState'
import {
  assert,
  assertUsage,
  assertWarning,
  getFileUrl,
  hasProp,
  isPlainObject,
  objectAssign,
  getProjectError,
} from './utils'
import { parse } from '@brillout/json-s/parse'
import { getPageContextSerializedInHtml } from '../getPageContextSerializedInHtml'
import { loadPageFiles2, PageContextPageFiles, isPageFileForPageId } from '../../shared/getPageFiles'
import type { PageContextUrls } from '../../shared/addComputedUrlProps'
import { assertHookResult } from '../../shared/assertHookResult'
import { PageContextForRoute, route } from '../../shared/route'
import { releasePageContext } from '../releasePageContext'

export { getPageContext }

type PageContextAddendum = {
  _pageId: string
  _pageContextRetrievedFromServer: null | Record<string, unknown>
  isHydration: boolean
  _comesDirectlyFromServer: boolean
} & PageContextPageFiles

type PageFileServer = {
  filePath: string
  fileExports: Record<string, unknown>
}

async function getPageContext(
  pageContext: {
    _pageFilesServerAll: PageFileServer[]
    _isFirstRender: boolean
  } & PageContextUrls &
    PageContextForRoute,
): Promise<PageContextAddendum> {
  if (pageContext._isFirstRender && navigationState.isOriginalUrl(pageContext.url)) {
    const pageContextAddendum = await getPageContextForFirstRender()
    return pageContextAddendum
  } else {
    const pageContextAddendum = await getPageContextForPageNavigation(pageContext)
    return pageContextAddendum
  }
}

async function getPageContextForFirstRender() {
  const pageContextAddendum = getPageContextSerializedInHtml()

  removeBuiltInOverrides(pageContextAddendum)

  const pageContextAddendum2 = await loadPageFiles2(pageContextAddendum._pageId, true)
  objectAssign(pageContextAddendum, pageContextAddendum2)

  objectAssign(pageContextAddendum, {
    isHydration: true,
    _comesDirectlyFromServer: true,
  })

  return pageContextAddendum
}

async function getPageContextForPageNavigation(
  pageContext: {
    _pageFilesServerAll: PageFileServer[]
  } & PageContextForRoute,
): Promise<PageContextAddendum> {
  const pageContextAddendum = {
    isHydration: false,
  }
  objectAssign(pageContextAddendum, await getPageContextFromRoute(pageContext))
  objectAssign(pageContextAddendum, await loadPageFiles2(pageContextAddendum._pageId, true))
  objectAssign(pageContextAddendum, await onBeforeRenderExec({ ...pageContext, ...pageContextAddendum }))
  assert([true, false].includes(pageContextAddendum._comesDirectlyFromServer))
  return pageContextAddendum
}

async function onBeforeRenderExec(
  pageContext: {
    _pageFilesServerAll: PageFileServer[]
    _pageId: string
    url: string
    isHydration: boolean
  } & PageContextPageFiles,
) {
  // `export { onBeforeRender }` defined in `.page.client.js`
  if (pageContext.exports.onBeforeRender) {
    const hookFile = pageContext.exportsAll.onBeforeRender![0]!.filePath
    assert(hookFile)
    assertUsage(
      hasProp(pageContext.exports, 'onBeforeRender', 'function'),
      'The `export { onBeforeRender }` of ' + hookFile + ' should be a function',
    )
    const pageContextAddendum = {
      _comesDirectlyFromServer: false,
      _pageContextRetrievedFromServer: null,
    }
    const pageContextReadyForRelease = releasePageContext({
      ...pageContext,
      ...pageContextAddendum,
    })
    const hookResult = await pageContext.exports.onBeforeRender(pageContextReadyForRelease)
    assertHookResult(hookResult, 'onBeforeRender', ['pageContext'], hookFile)
    const pageContextFromHook = hookResult?.pageContext
    objectAssign(pageContextAddendum, pageContextFromHook)
    return pageContextAddendum
  }

  // `export { onBeforeRender }` defined in `.page.server.js`
  else if (hasOnBeforeRenderServerSide(pageContext)) {
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
  if ('hookError' in routeResult) {
    throw routeResult.hookError
  }
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

function hasOnBeforeRenderServerSide(pageContext: { _pageId: string; _pageFilesServerAll: PageFileServer[] }) {
  return pageContext._pageFilesServerAll
    .filter((pageFile) => isPageFileForPageId(pageFile, pageContext._pageId))
    .some(({ fileExports }) => {
      assert(hasProp(fileExports, 'hasExport_onBeforeRender', 'boolean'))
      assert(Object.keys(fileExports).length === 1)
      return fileExports.hasExport_onBeforeRender === true
    })
}
async function retrievePageContextFromServer(pageContext: { url: string }): Promise<Record<string, unknown>> {
  const pageContextUrl = getFileUrl(pageContext.url, '.pageContext.json', true)
  const response = await fetch(pageContextUrl)

  // Static hosts return a 404
  assert(response.status !== 404)

  {
    const contentType = response.headers.get('content-type')
    assertUsage(
      contentType && contentType.includes('application/json'),
      `Wrong HTTP Response Header \`content-type\` value for URL ${pageContextUrl} (it should be \`application/json\` but we got \`${contentType}\`). Make sure to use \`pageContext.httpResponse.contentType\`, see https://github.com/brillout/vite-plugin-ssr/issues/191`,
    )
  }

  const responseText = await response.text()
  const responseObject = parse(responseText) as { pageContext: Record<string, unknown> } | { serverSideError: true }
  assert(!('pageContext404PageDoesNotExist' in responseObject))
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

const BUILT_IN_CLIENT_ROUTER = ['urlPathname', 'urlParsed'] as const
const BUILT_IN_CLIENT = ['Page', 'pageExports', 'exports'] as const
type DeletedKeys = typeof BUILT_IN_CLIENT[number] | typeof BUILT_IN_CLIENT_ROUTER[number]
function removeBuiltInOverrides(pageContext: Record<string, unknown> & { [key in DeletedKeys]?: never }) {
  const alreadySet = [...BUILT_IN_CLIENT, ...BUILT_IN_CLIENT_ROUTER]
  alreadySet.forEach((prop) => {
    if (prop in pageContext) {
      // We need to cast `BUILT_IN_CLIENT` to `string[]`
      //  - https://stackoverflow.com/questions/56565528/typescript-const-assertions-how-to-use-array-prototype-includes
      //  - https://stackoverflow.com/questions/57646355/check-if-string-is-included-in-readonlyarray-in-typescript
      if ((BUILT_IN_CLIENT_ROUTER as any as string[]).includes(prop)) {
        assert(prop.startsWith('url'))
        assertWarning(
          false,
          `\`pageContext.${prop}\` is already available in the browser when using \`useClientRouter()\`; including \`${prop}\` in \`passToClient\` has no effect.`,
        )
      } else {
        assertWarning(
          false,
          `\`pageContext.${prop}\` is a built-in that cannot be overriden; including \`${prop}\` in \`passToClient\` has no effect.`,
        )
      }
      delete pageContext[prop]
    }
  })
}
