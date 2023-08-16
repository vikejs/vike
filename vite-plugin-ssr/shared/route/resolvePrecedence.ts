export { resolvePrecendence }
// export type { RouteMatch }

import { analyzeRouteString } from './resolveRouteString.js'
import { higherFirst } from './utils.js'
import { makeFirst } from './utils.js'
import { isStaticRouteString } from './resolveRouteString.js'
import type { RouteType } from './loadPageRoutes.js'

type RouteMatch = {
  precedence?: number | null
  routeString?: string
  routeType: RouteType
}

// See https://vite-plugin-ssr.com/route-function#precedence
function resolvePrecendence<T extends RouteMatch>(routeMatches: T[]): void {
  // prettier-ignore
  routeMatches
    .sort(sortMatches)
    .sort(makeFirst((routeMatch) => routeMatch.routeType === 'FUNCTION' && !!routeMatch.precedence && routeMatch.precedence < 0))
    .sort(makeFirst((routeMatch) => routeMatch.routeType === 'STRING'   && isStaticRouteString(routeMatch.routeString!) === false))
    .sort(makeFirst((routeMatch) => routeMatch.routeType === 'FUNCTION' && !routeMatch.precedence))
    .sort(makeFirst((routeMatch) => routeMatch.routeType === 'STRING'   && isStaticRouteString(routeMatch.routeString!) === true))
    .sort(makeFirst((routeMatch) => routeMatch.routeType === 'FILESYSTEM'))
    .sort(makeFirst((routeMatch) => routeMatch.routeType === 'FUNCTION' && !!routeMatch.precedence && routeMatch.precedence > 0))
}

// -1 => routeMatch1 higher precedence
// +1 => routeMatch2 higher precedence
function sortMatches(routeMatch1: RouteMatch, routeMatch2: RouteMatch): 0 | -1 | 1 {
  {
    const precedence1 = routeMatch1.precedence ?? 0
    const precedence2 = routeMatch2.precedence ?? 0
    if (precedence1 !== precedence2) {
      return precedence1 > precedence2 ? -1 : 1
    }
  }

  if (!routeMatch2.routeString) {
    return 0
  }
  if (!routeMatch1.routeString) {
    return 0
  }

  // Return route with highest number of static path segments at beginning first
  {
    const getValue = (routeString: string) => analyzeRouteString(routeString).numberOfStaticSegmentsBeginning
    const result = higherFirst(getValue)(routeMatch1.routeString, routeMatch2.routeString)
    if (result !== 0) {
      return result
    }
  }

  // Return route with highest number of static path segments in total first
  {
    const getValue = (routeString: string) => analyzeRouteString(routeString).numberOfStaticSegements
    const result = higherFirst(getValue)(routeMatch1.routeString, routeMatch2.routeString)
    if (result !== 0) {
      return result
    }
  }

  // Return route with most parameter segements first
  {
    const getValue = (routeString: string) => analyzeRouteString(routeString).numberOfParameterSegments
    const result = higherFirst(getValue)(routeMatch1.routeString, routeMatch2.routeString)
    if (result !== 0) {
      return result
    }
  }

  // Return catch-all routes last
  {
    if (analyzeRouteString(routeMatch2.routeString).isCatchAll) {
      return -1
    }
    if (analyzeRouteString(routeMatch1.routeString).isCatchAll) {
      return 1
    }
  }

  return 0
}
