export { resolveRoute }

import { assertUsage } from './utils.mjs'
import { resolveRouteString } from './resolveRouteString.mjs'

function resolveRoute(
  routeString: string,
  urlPathname: string
): { match: boolean; routeParams: Record<string, string> } {
  const errMsg = (propName: 'routeString' | 'urlPathname', msg = 'a non-empty string') =>
    `[resolveRoute(routeString, urlPathname)] \`${propName}\` should be ` + msg
  assertUsage(routeString, errMsg('routeString'), { showStackTrace: true })
  assertUsage(urlPathname, errMsg('urlPathname'), { showStackTrace: true })
  assertUsage(urlPathname.startsWith('/'), errMsg('urlPathname', '`pageContext.urlPathname`'), { showStackTrace: true })
  const result = resolveRouteString(routeString, urlPathname)
  return {
    match: !!result,
    routeParams: result?.routeParams ?? {}
  }
}
