import { matchPath } from './matchPath'
import { assert, isPlainObject, higherFirst } from '../utils'

export { resolveRouteString }
export { resolveRouteStringPrecedence }

function resolveRouteString(
  routeString: string,
  urlPathname: string
): { isMatch: boolean; routeParams: Record<string, string> } {
  const match = matchPath({ path: routeString, caseSensitive: true }, urlPathname)
  if (!match) {
    return { isMatch: false, routeParams: {} }
  }

  const routeParams: Record<string, string> = match.params || {}
  assert(isPlainObject(routeParams))

  return { isMatch: true, routeParams }
}

type RouteMatch = {
  routeString: null | string
}
// -1 => routeMatch1 higher precedence
// +1 => routeMatch2 higher precedence
function resolveRouteStringPrecedence(routeMatch1: RouteMatch, routeMatch2: RouteMatch): 0 | -1 | 1 {
  if (routeMatch2.routeString === null) {
    return 0
  }
  if (routeMatch1.routeString === null) {
    return 0
  }

  // Return route with highest number of static paths begin first
  {
    const getValue = (routeString: string) => analyzeRouteString(routeString).numberOfStaticPathBegin
    const result = higherFirst(getValue)(routeMatch1.routeString, routeMatch2.routeString)
    if (result !== 0) {
      return result
    }
  }

  // Return route with most params first
  {
    const getValue = (routeString: string) => analyzeRouteString(routeString).numberOfParams
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
function analyzeRouteString(routeString: string) {
  const paths = routeString.split('/')

  let numberOfStaticPathBegin = 0
  for (const path of paths) {
    if (path.startsWith(':')) {
      break
    }
    if (path === '') {
      continue
    }
    if (path === '*') {
      continue
    }
    numberOfStaticPathBegin++
  }

  const numberOfParams = paths.filter((path) => path.startsWith(':')).length

  const isCatchAll = routeString.endsWith('*')

  return { numberOfParams, numberOfStaticPathBegin, isCatchAll }
}
