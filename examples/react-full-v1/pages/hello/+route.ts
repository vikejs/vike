export { route }

import type { PageContextClient, PageContextServer, RouteSync } from 'vike/types'
import { resolveRoute } from 'vike/routing'

// Route Functions enables advanced routing logic
const route: RouteSync = (pageContext: PageContextServer | PageContextClient): ReturnType<RouteSync> => {
  if (pageContext.urlPathname === '/hello' || pageContext.urlPathname === '/hello/') {
    const name = 'anonymous'
    return { routeParams: { name } }
  }
  return resolveRoute('/hello/@name', pageContext.urlPathname)
}
