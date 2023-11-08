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

import type { PageFile } from '../getPageFiles.js'
import { assert, assertUsage, hasProp, isPlainObject, objectAssign } from './utils.js'
import {
  addUrlComputedProps,
  PageContextUrlComputedPropsInternal,
  PageContextUrlSources
} from '../addUrlComputedProps.js'
import { resolvePrecendence } from './resolvePrecedence.js'
import { resolveRouteString } from './resolveRouteString.js'
import { resolveRouteFunction } from './resolveRouteFunction.js'
import { executeOnBeforeRouteHook, type OnBeforeRouteHook } from './executeOnBeforeRouteHook.js'
import type { PageRoutes, RouteType } from './loadPageRoutes.js'
import { debug } from './debug.js'
import type { PageConfigRuntime, PageConfigGlobalRuntime } from '../page-configs/PageConfig.js'
import pc from '@brillout/picocolors'

type PageContextForRoute = PageContextUrlComputedPropsInternal & {
  _pageFilesAll: PageFile[]
  _pageConfigs: PageConfigRuntime[]
  _allPageIds: string[]
  _pageConfigGlobal: PageConfigGlobalRuntime
  _pageRoutes: PageRoutes
  _onBeforeRouteHook: OnBeforeRouteHook | null
} & PageContextUrlSources
type PageContextFromRoute = {
  _pageId: string | null
  routeParams: Record<string, string>
  _routingProvidedByOnBeforeRouteHook?: boolean
  _debugRouteMatches: RouteMatches
}
type RouteMatch = {
  pageId: string
  routeString?: string
  precedence?: number | null
  routeType: RouteType
  routeParams: Record<string, string>
}
type RouteMatches = 'CUSTOM_ROUTING' | RouteMatch[]

async function route(pageContext: PageContextForRoute): Promise<PageContextFromRoute> {
  debug('Pages routes:', pageContext._pageRoutes)
  addUrlComputedProps(pageContext)
  const pageContextAddendum = {}

  // onBeforeRoute()
  const pageContextFromOnBeforeRouteHook = await executeOnBeforeRouteHook(pageContext)
  if (pageContextFromOnBeforeRouteHook) {
    if (pageContextFromOnBeforeRouteHook._routingProvidedByOnBeforeRouteHook) {
      assert(pageContextFromOnBeforeRouteHook._pageId)
      return pageContextFromOnBeforeRouteHook
    } else {
      objectAssign(pageContextAddendum, pageContextFromOnBeforeRouteHook)
    }
  }

  // Vike's routing
  const allPageIds = pageContext._allPageIds
  assert(allPageIds.length >= 0)
  assertUsage(
    pageContext._pageFilesAll.length > 0 || pageContext._pageConfigs.length > 0,
    'No *.page.js file found. You must create at least one *.page.js file.'
  )
  assertUsage(allPageIds.length > 0, "You must create at least one *.page.js file that isn't _default.page.*")
  const { urlPathname } = pageContext
  assert(urlPathname.startsWith('/'))

  const routeMatches: RouteMatch[] = []
  await Promise.all(
    pageContext._pageRoutes.map(async (pageRoute): Promise<void> => {
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
        const { routeFunction, routeDefinedAt } = pageRoute
        const match = await resolveRouteFunction(routeFunction, pageContext, routeDefinedAt)
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

  debug(`Route matches for URL ${pc.cyan(urlPathname)} (in precedence order):`, routeMatches)

  objectAssign(pageContextAddendum, { _debugRouteMatches: routeMatches })

  if (!winner) {
    objectAssign(pageContextAddendum, {
      _pageId: null,
      routeParams: {}
    })
    return pageContextAddendum
  }

  {
    const { routeParams } = winner
    assert(isPlainObject(routeParams))
    objectAssign(pageContextAddendum, {
      _pageId: winner.pageId,
      routeParams: winner.routeParams
    })
  }

  return pageContextAddendum
}
