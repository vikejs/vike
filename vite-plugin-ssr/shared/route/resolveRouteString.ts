import { matchPath } from './matchPath'
import { assert, isPlainObject } from '../utils'

export { resolveRouteString }

function resolveRouteString(
  routeString: string,
  urlPathname: string
): { matchValue: false | number; routeParams: Record<string, string> } {
  const match = matchPath({ path: routeString, caseSensitive: true }, urlPathname)
  if (!match) {
    return { matchValue: false, routeParams: {} }
  }

  const routeParams: Record<string, string> = match.params || {}
  assert(isPlainObject(routeParams))

  const matchValue = getMatchValue(routeParams)

  return { matchValue, routeParams }
}

// See tests at `./routePrioritization.spec.ts`
function getMatchValue(routeParams: Record<string, string>): number {
  // The less parameters the route has, the more specific it is, and the higher its prio should be, for example:
  //   URL                     matchValue
  //   /                       -0
  //   /some/static/route      -0
  //   /:productId             -1
  //   /:productId/reviews     -1
  //   /:productId/:view       -2
  let matchValue = -1 * Object.keys(routeParams).length

  // For catch-all routes, it's the opposite, for example:
  //   URL                     matchValue
  //   /nested/*               -98
  //   /*                      -99
  if (routeParams['*']) {
    matchValue = -100 - matchValue
  }

  return matchValue
}
