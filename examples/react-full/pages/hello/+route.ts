// https://vike.dev/route
export { route }

import type { RouteSync } from 'vike/types'
import { resolveRoute } from 'vike/routing'

// Route Functions enables advanced routing logic
const route: RouteSync = (pageContext): ReturnType<RouteSync> => {
  if (pageContext.urlPathname === '/hello' || pageContext.urlPathname === '/hello/') {
    const name = 'anonymous'
    return { routeParams: { name } }
  }
  return resolveRoute('/hello/@name', pageContext.urlPathname)
}
