import type { PageFile3 } from './getPageFiles'
import { assert, assertUsage, hasProp, isPlainObject, objectAssign } from './utils'
import { addComputedUrlProps, PageContextUrlSource } from './addComputedUrlProps'
import { pickWinner, RouteType } from './route/pickWinner'
import { resolveRouteString } from './route/resolveRouteString'
import { resolveFilesystemRoute } from './route/resolveFilesystemRoute'
import { resolveRouteFunction } from './route/resolveRouteFunction'
import { callOnBeforeRouteHook } from './route/callOnBeforeRouteHook'
import { PageRoutes, loadPageRoutes } from './route/loadPageRoutes'
import { isErrorPage } from './route/error-page'

export { route }
export type { PageRoutes }
export type { PageContextForRoute }

export { isErrorPage }
export { getErrorPageId } from './route/error-page'
export { isStaticRoute } from './route/resolveRouteString'

type PageContextForRoute = PageContextUrlSource & {
  _pageFilesAll: PageFile3[]
  _allPageIds: string[]
}
type HookError = { hookError: unknown; hookName: string; hookFilePath: string }
async function route(
  pageContext: PageContextForRoute,
): Promise<
  | HookError
  | { pageContextAddendum: { _pageId: string | null; routeParams: Record<string, string> } & Record<string, unknown> }
> {
  addComputedUrlProps(pageContext)

  const { pageRoutes, onBeforeRouteHook } = await loadPageRoutes(pageContext)

  const pageContextAddendum = {}
  if (onBeforeRouteHook) {
    const hookResult = await callOnBeforeRouteHook(onBeforeRouteHook, pageContext)
    if ('hookError' in hookResult) {
      return hookResult
    }
    if ('pageContextProvidedByUser' in hookResult) {
      objectAssign(pageContextAddendum, hookResult.pageContextProvidedByUser)
      if (hasProp(pageContextAddendum, '_pageId', 'string') || hasProp(pageContextAddendum, '_pageId', 'null')) {
        // We bypass `vite-plugin-ssr`'s routing
        if (!hasProp(pageContextAddendum, 'routeParams')) {
          objectAssign(pageContextAddendum, { routeParams: {} })
        } else {
          assert(hasProp(pageContextAddendum, 'routeParams', 'object'))
        }
        return { pageContextAddendum }
      }
      // We already assign so that `pageContext.url === pageContextAddendum.url`; enabling the `onBeforeRoute()` hook to mutate `pageContext.url` before routing.
      objectAssign(pageContext, pageContextAddendum)
    }
  }

  // `vite-plugin-ssr`'s routing
  const allPageIds = pageContext._allPageIds
  assert(allPageIds.length >= 0)
  assertUsage(
    allPageIds.length > 0,
    'No `*.page.js` file found. You must create a `*.page.js` file, e.g. `pages/index.page.js` (or `pages/index.page.{jsx, tsx, vue, ...}`).',
  )
  const { urlPathname } = pageContext
  assert(urlPathname.startsWith('/'))

  const hookErrors: HookError[] = []
  const routeMatches: {
    pageId: string
    routeString?: string
    precedence?: number | null
    routeType: RouteType
    routeParams: Record<string, string>
  }[] = []
  await Promise.all(
    pageRoutes.map(async (pageRoute): Promise<void> => {
      const { pageId, filesystemRoute, pageRouteFile } = pageRoute

      if (!pageRouteFile) {
        const match = resolveFilesystemRoute(filesystemRoute, urlPathname)
        if (match) {
          const { routeParams } = match
          routeMatches.push({ pageId, routeParams, routeType: 'FILESYSTEM' })
        }
      } else {
        const pageRouteFileExports = pageRouteFile.fileExports
        const pageRouteFilePath = pageRouteFile.filePath

        // Route with Route String defined in `.page.route.js`
        if (hasProp(pageRouteFileExports, 'default', 'string')) {
          const routeString = pageRouteFileExports.default
          assertUsage(
            routeString.startsWith('/'),
            `A Route String should start with a leading \`/\` but \`${pageRouteFilePath}\` has \`export default '${routeString}'\`. Make sure to \`export default '/${routeString}'\` instead.`,
          )
          const match = resolveRouteString(routeString, urlPathname)
          if (match) {
            const { routeParams } = match
            routeMatches.push({
              pageId,
              routeString,
              routeParams,
              routeType: 'STRING',
            })
          }
        }

        // Route with Route Function defined in `.page.route.js`
        else if (hasProp(pageRouteFileExports, 'default', 'function')) {
          const match = await resolveRouteFunction(pageRouteFileExports, urlPathname, pageContext, pageRouteFilePath)
          if (match && 'hookError' in match) {
            hookErrors.push(match)
            return
          }
          if (match) {
            const { routeParams, precedence } = match
            routeMatches.push({ pageId, precedence, routeParams, routeType: 'FUNCTION' })
          }
        } else {
          assert(false)
        }
      }
    }),
  )

  if (hookErrors.length > 0) {
    return hookErrors[0]!
  }

  // console.log('[Route Matches]:', JSON.stringify(routeMatches, null, 2))
  const winner = pickWinner(routeMatches)
  // console.log('[Route Match]:', `[${urlPathname}]: ${winner && winner.pageId}`)

  if (!winner) {
    objectAssign(pageContextAddendum, {
      _pageId: null,
      routeParams: {},
    })
    return { pageContextAddendum }
  }

  const { pageId, routeParams } = winner
  assert(isPlainObject(routeParams))
  objectAssign(pageContextAddendum, {
    _pageId: pageId,
    routeParams,
  })
  return { pageContextAddendum }
}
