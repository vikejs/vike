export { route }
export { loadPageRoutes } from './route/loadPageRoutes'
export { isErrorPageId, getErrorPageId } from './route/error-page'
export type { PageRoutes, PageContextForRoute, RouteMatches }

import type { PageFile } from './getPageFiles'
import { assert, assertUsage, hasProp, isPlainObject, objectAssign } from './utils'
import { addComputedUrlProps, PageContextUrlSource } from './addComputedUrlProps'
import { resolvePrecendence } from './route/resolvePrecedence'
import { resolveRouteString } from './route/resolveRouteString'
import { resolveRouteFunction } from './route/resolveRouteFunction'
import { callOnBeforeRouteHook } from './route/callOnBeforeRouteHook'
import { PageRoutes, loadPageRoutes, RouteType } from './route/loadPageRoutes'
import { debug } from './route/debug'

type PageContextForRoute = PageContextUrlSource & {
  _pageFilesAll: PageFile[]
  _allPageIds: string[]
}
type RouteMatch = {
  pageId: string
  routeString?: string
  precedence?: number | null
  routeType: RouteType
  routeParams: Record<string, string>
}
type RouteMatches = 'CUSTOM_ROUTE' | RouteMatch[]

async function route(pageContext: PageContextForRoute): Promise<{
  pageContextAddendum: {
    _pageId: string | null
    routeParams: Record<string, string>
    _routingProvidedByOnBeforeRouteHook: boolean
    _routeMatches: RouteMatches
  } & Record<string, unknown>
}> {
  addComputedUrlProps(pageContext)

  const { pageRoutes, onBeforeRouteHook } = await loadPageRoutes(pageContext)
  debug('Pages routes:', pageRoutes)

  const pageContextAddendum = {}
  if (onBeforeRouteHook) {
    const pageContextAddendumHook = await callOnBeforeRouteHook(onBeforeRouteHook, pageContext)
    if (pageContextAddendumHook) {
      objectAssign(pageContextAddendum, pageContextAddendumHook)
      if (hasProp(pageContextAddendum, '_pageId', 'string') || hasProp(pageContextAddendum, '_pageId', 'null')) {
        // We bypass `vite-plugin-ssr`'s routing
        if (!hasProp(pageContextAddendum, 'routeParams')) {
          objectAssign(pageContextAddendum, { routeParams: {} })
        } else {
          assert(hasProp(pageContextAddendum, 'routeParams', 'object'))
        }
        objectAssign(pageContextAddendum, {
          _routingProvidedByOnBeforeRouteHook: true,
          _routeMatches: 'CUSTOM_ROUTE' as const
        })
        return { pageContextAddendum }
      }
      // We already assign so that `pageContext.urlOriginal === pageContextAddendum.urlOriginal`; enabling the `onBeforeRoute()` hook to mutate `pageContext.urlOriginal` before routing.
      objectAssign(pageContext, pageContextAddendum)
    }
  }
  objectAssign(pageContextAddendum, {
    _routingProvidedByOnBeforeRouteHook: false
  })

  // `vite-plugin-ssr`'s routing
  const allPageIds = pageContext._allPageIds
  assert(allPageIds.length >= 0)
  assertUsage(
    allPageIds.length > 0,
    'No `*.page.js` file found. You must create a `*.page.js` file, e.g. `pages/index.page.js` (or `pages/index.page.{jsx, tsx, vue, ...}`).'
  )
  const { urlPathname } = pageContext
  assert(urlPathname.startsWith('/'))

  const routeMatches: RouteMatch[] = []
  await Promise.all(
    pageRoutes.map(async (pageRoute): Promise<void> => {
      const { pageId, routeType } = pageRoute

      // Filesytem Routing
      if (pageRoute.routeType === 'FILESYSTEM') {
        const { routeString } = pageRoute
        const match = resolveRouteString(routeString, urlPathname)
        if (match) {
          const { routeParams } = match
          routeMatches.push({ pageId, routeParams, routeString, routeType })
        }
        return
      }

      // Route String defined in `.page.route.js`
      if (pageRoute.routeType === 'STRING') {
        const { routeString } = pageRoute
        const match = resolveRouteString(routeString, urlPathname)
        if (match) {
          const { routeParams } = match
          assert(routeType === 'STRING')
          routeMatches.push({
            pageId,
            routeString,
            routeParams,
            routeType
          })
        }
        return
      }

      // Route Function defined in `.page.route.js`
      if (pageRoute.routeType === 'FUNCTION') {
        const { routeFunction, allowAsync, pageRouteFilePath } = pageRoute
        const match = await resolveRouteFunction(routeFunction, allowAsync, pageContext, pageRouteFilePath)
        if (match) {
          const { routeParams, precedence } = match
          routeMatches.push({ pageId, precedence, routeParams, routeType })
        }
        return
      }

      assert(false)
    })
  )

  resolvePrecendence(routeMatches)
  const winner = routeMatches[0]

  debug(`Route matches for URL \`${urlPathname}\` (in precedence order):`, routeMatches)

  objectAssign(pageContextAddendum, { _routeMatches: routeMatches })

  if (!winner) {
    objectAssign(pageContextAddendum, {
      _pageId: null,
      routeParams: {}
    })
    return { pageContextAddendum }
  }

  {
    const { routeParams } = winner
    assert(isPlainObject(routeParams))
    objectAssign(pageContextAddendum, {
      _pageId: winner.pageId,
      routeParams: winner.routeParams
    })
  }

  return { pageContextAddendum }
}
