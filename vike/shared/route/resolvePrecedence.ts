export { resolvePrecendence }
// export type { RouteMatch }

import { analyzeRouteString } from './resolveRouteString.js'
import { higherFirst, lowerFirst } from './utils.js'
import { makeFirst } from './utils.js'
import { isStaticRouteString } from './resolveRouteString.js'
import type { RouteType } from './loadPageRoutes.js'

type RouteMatch = {
  precedence?: number | null
  routeString?: string
  routeType: RouteType
}

// See https://vike.dev/route-function#precedence
function resolvePrecendence<T extends RouteMatch>(routeMatches: T[]): void {
  // prettier-ignore
  // biome-ignore format:
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

  /* DEBUG
  console.log('routeMatch1.routeString', routeMatch1.routeString)
  console.log('routeMatch2.routeString', routeMatch2.routeString)
  console.log('parseRouteString(routeMatch1.routeString)', parseRouteString(routeMatch1.routeString))
  console.log('parseRouteString(routeMatch2.routeString)', parseRouteString(routeMatch2.routeString))
  //*/

  // Return route with highest number of static path segments at beginning first
  {
    const getValue = (routeString: string) => analyzeRouteString(routeString).numberOfStaticPartsBeginning
    const result = higherFirst(getValue)(routeMatch1.routeString, routeMatch2.routeString)
    if (result !== 0) {
      /* DEBUG
      console.log('analyzeRouteString(routeMatch1.routeString).numberOfStaticPartsBeginning', getValue(routeMatch1.routeString))
      console.log('analyzeRouteString(routeMatch2.routeString).numberOfStaticPartsBeginning', getValue(routeMatch2.routeString))
      //*/
      return result
    }
  }

  // Return route with highest number of static path segments in total first
  {
    const getValue = (routeString: string) => analyzeRouteString(routeString).numberOfStaticParts
    const result = higherFirst(getValue)(routeMatch1.routeString, routeMatch2.routeString)
    if (result !== 0) {
      /* DEBUG
      console.log('analyzeRouteString(routeMatch1.routeString).numberOfStaticParts', getValue(routeMatch1.routeString))
      console.log('analyzeRouteString(routeMatch2.routeString).numberOfStaticParts', getValue(routeMatch2.routeString))
      //*/
      return result
    }
  }

  // Return route with least amount of globs first
  {
    const getValue = (routeString: string) => analyzeRouteString(routeString).numberOfGlobs
    const result = lowerFirst(getValue)(routeMatch1.routeString, routeMatch2.routeString)
    if (result !== 0) {
      /* DEBUG
      console.log('analyzeRouteString(routeMatch1.routeString).numberOfGlobs', getValue(routeMatch1.routeString))
      console.log('analyzeRouteString(routeMatch2.routeString).numberOfGlobs', getValue(routeMatch2.routeString))
      //*/
      return result
    }
  }

  // Return route with highest number of parameters first
  {
    const getValue = (routeString: string) => analyzeRouteString(routeString).numberOfParams
    const result = higherFirst(getValue)(routeMatch1.routeString, routeMatch2.routeString)
    if (result !== 0) {
      /* DEBUG
      console.log('analyzeRouteString(routeMatch1.routeString).numberOfParams', getValue(routeMatch1.routeString))
      console.log('analyzeRouteString(routeMatch2.routeString).numberOfParams', getValue(routeMatch2.routeString))
      //*/
      return result
    }
  }

  return 0
}
