export { resolveRoute }

import { assertUsage } from './utils'
import { resolveRouteString } from './resolveRouteString'

function resolveRoute(
  routeString: string,
  urlPathname: string,
): { match: boolean; routeParams: Record<string, string> } {
  const errMsg = (propName: 'routeString' | 'urlPathname', msg = 'a non-empty string') =>
    `[resolveRoute(routeString, urlPathname)] \`${propName}\` should be ` + msg
  assertUsage(routeString, errMsg('routeString'))
  assertUsage(urlPathname, errMsg('urlPathname'))
  assertUsage(urlPathname.startsWith('/'), errMsg('urlPathname', '`pageContext.urlPathname`'))
  const result = resolveRouteString(routeString, urlPathname)
  return {
    match: !!result,
    routeParams: result?.routeParams ?? {},
  }
}
