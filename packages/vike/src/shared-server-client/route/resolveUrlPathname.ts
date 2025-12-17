export { resolveUrlPathname }

import { assertIsNotBrowser } from '../../utils/assertIsNotBrowser.js'
import { assert, assertUsage } from '../utils.js'
assertIsNotBrowser() // Don't bloat the client

type Part =
  | {
      type: 'ROUTE_STRING'
      val: string
    }
  | {
      type: 'URL'
      val: string
    }
/** Given a `routeString` and `routeParams`, resolve `urlPathname`.
 *
 * Basically, the correct implementation of following:
 * ```js
 * let urlPathname = routeString
 * Object.entries(routeParams).forEach(([key, val]) => {
 *   urlPathname = urlPathname.replaceAll(key, val)
 * })
 * ```
 */
function resolveUrlPathname(routeString: string, routeParams: Record<string, string>): string {
  let parts: Part[] = [{ val: routeString, type: 'ROUTE_STRING' }]

  Object.entries(routeParams).forEach(([key, val]) => {
    if (key.startsWith('*')) {
      assert(key === '*' || /\d+/.test(key.slice(1)))
      assertUsage(key === '*', "Resolving URL with multiple globs isn't implemented yet")
    } else {
      key = `@${key}`
    }
    parts = parts
      .map((part) => {
        if (part.type === 'URL') {
          return part
        } else {
          return part.val
            .split(key)
            .map((rest, i) => {
              const partURL = { val, type: 'URL' as const }
              const partRouteString = { val: rest, type: 'ROUTE_STRING' as const }
              return i === 0 ? [partRouteString] : [partURL, partRouteString]
            })
            .flat()
        }
      })
      .flat()
  })

  const urlPathname = parts.map((p) => p.val).join('')
  return urlPathname
}
