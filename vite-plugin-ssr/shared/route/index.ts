export { route }
export type { PageRoutes, PageContextForRoute, RouteMatches }

// Ensure we don't bloat runtime of Server Routing
import { assertClientRouting } from '../../utils/assertRoutingType.js'
import { isBrowser } from '../../utils/isBrowser.js'
if (isBrowser()) {
  assertClientRouting()
}

import type { PageFile } from '../getPageFiles.js'
import { assert, assertUsage, hasProp, isPlainObject, objectAssign } from './utils.js'
import { addUrlComputedProps, PageContextUrlComputedProps, PageContextUrlSources } from '../UrlComputedProps.js'
import { resolvePrecendence } from './resolvePrecedence.js'
import { resolveRouteString } from './resolveRouteString.js'
import { resolveRouteFunction } from './resolveRouteFunction.js'
import { executeOnBeforeRouteHook, type OnBeforeRouteHook } from './executeOnBeforeRouteHook.js'
import type { PageRoutes, RouteType } from './loadPageRoutes.js'
import { debug } from './debug.js'
import type { PageConfig, PageConfigGlobal } from '../page-configs/PageConfig.js'

type PageContextForRoute = PageContextUrlComputedProps & {
  _pageFilesAll: PageFile[]
  _pageConfigs: PageConfig[]
  _allPageIds: string[]
  _pageConfigGlobal: PageConfigGlobal
  _pageRoutes: PageRoutes
  _onBeforeRouteHook: OnBeforeRouteHook | null
} & PageContextUrlSources
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
  addUrlComputedProps(pageContext)

  debug('Pages routes:', pageContext._pageRoutes)

  const pageContextAddendum = {}
  if (pageContext._onBeforeRouteHook) {
    const pageContextAddendumHook = await executeOnBeforeRouteHook(pageContext._onBeforeRouteHook, pageContext)
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
