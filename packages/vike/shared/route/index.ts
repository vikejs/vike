export { route }
export type { PageContextForRoute }
export type { PageContextFromRoute }
export type { PageRoutes }
export type { RouteMatches }

// Ensure we don't bloat runtime of Server Routing
import { assertClientRouting } from '../../utils/assertRoutingType.js'
import { isBrowser } from '../../utils/isBrowser.js'
if (isBrowser()) {
  assertClientRouting()
}

import { assert, assertUsage, isPlainObject, objectAssign } from './utils.js'
import { type PageContextUrlInternal, type PageContextUrlSource } from '../getPageContextUrlComputed.js'
import { resolvePrecedence } from './resolvePrecedence.js'
import { resolveRouteString } from './resolveRouteString.js'
import { resolveRouteFunction } from './resolveRouteFunction.js'
import { execHookOnBeforeRoute } from './execHookOnBeforeRoute.js'
import type { PageRoutes, RouteType } from './loadPageRoutes.js'
import { debug } from './debug.js'
import pc from '@brillout/picocolors'
import type { GlobalContextInternal } from '../createGlobalContextShared.js'

type PageContextForRoute = PageContextUrlInternal & {
  _globalContext: GlobalContextInternal
} & PageContextUrlSource
type PageContextFromRoute = {
  pageId: string | null
  routeParams: Record<string, string>
  _routingProvidedByOnBeforeRouteHook?: boolean
}
type RouteMatch = {
  pageId: string
  routeString?: string
  precedence?: number | null
  routeType: RouteType
  routeParams: Record<string, string>
}
type RouteMatches = 'CUSTOM_ROUTING' | RouteMatch[]

// TO-DO/next-major-release: make it sync
async function route(pageContext: PageContextForRoute, skipOnBeforeRouteHook?: true): Promise<PageContextFromRoute> {
  debug('Pages routes:', pageContext._globalContext._pageRoutes)
  const pageContextFromRoute = {}

  // onBeforeRoute()
  if (!skipOnBeforeRouteHook) {
    const pageContextFromOnBeforeRouteHook = await execHookOnBeforeRoute(pageContext)
    if (pageContextFromOnBeforeRouteHook) {
      if (pageContextFromOnBeforeRouteHook._routingProvidedByOnBeforeRouteHook) {
        assert(pageContextFromOnBeforeRouteHook.pageId)
        return pageContextFromOnBeforeRouteHook
      } else {
        objectAssign(pageContextFromRoute, pageContextFromOnBeforeRouteHook)
      }
    }
    // We take into account pageContext.urlLogical set by onBeforeRoute()
    objectAssign(pageContext, pageContextFromOnBeforeRouteHook)
  }

  // Vike's routing
  const allPageIds = pageContext._globalContext._allPageIds
  assertUsage(allPageIds.length > 0, 'No page found. You must create at least one page.')
  assert(pageContext._globalContext._pageFilesAll.length > 0 || pageContext._globalContext._pageConfigs.length > 0)
  const { urlPathname } = pageContext
  assert(urlPathname.startsWith('/'))

  const routeMatches: RouteMatch[] = []
  await Promise.all(
    pageContext._globalContext._pageRoutes.map(async (pageRoute): Promise<void> => {
      const { pageId, routeType } = pageRoute

      // Filesystem Routing
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
            routeType,
          })
        }
        return
      }

      // Route Function defined in `.page.route.js`
      if (pageRoute.routeType === 'FUNCTION') {
        const { routeFunction, routeFunctionFilePath } = pageRoute
        const match = await resolveRouteFunction(routeFunction, pageContext, routeFunctionFilePath)
        if (match) {
          const { routeParams, precedence } = match
          routeMatches.push({ pageId, precedence, routeParams, routeType })
        }
        return
      }

      assert(false)
    }),
  )

  resolvePrecedence(routeMatches)
  const winner = routeMatches[0] ?? null

  debug(`Route matches for URL ${pc.cyan(urlPathname)} (in precedence order):`, routeMatches)

  // For vite-plugin-vercel https://github.com/magne4000/vite-plugin-vercel/blob/main/packages/vike-integration/vike.ts#L173
  objectAssign(pageContextFromRoute, { _routeMatch: winner })

  if (!winner) {
    objectAssign(pageContextFromRoute, {
      pageId: null,
      routeParams: {},
    })
    return pageContextFromRoute
  }

  {
    const { routeParams } = winner
    assert(isPlainObject(routeParams))
    objectAssign(pageContextFromRoute, {
      pageId: winner.pageId,
      routeParams: winner.routeParams,
    })
  }

  return pageContextFromRoute
}
