// https://vike.dev/route
export { route }

import type { PageContextServer, PageContextClient } from 'vike/types'
import { resolveRoute } from 'vike/routing'

// Route Functions enables advanced routing logic
const route = (pageContext: PageContextServer | PageContextClient) => {
  if (pageContext.urlPathname === '/hello' || pageContext.urlPathname === '/hello/') {
    const name = 'anonymous'
    return { routeParams: { name } }
  }
  return resolveRoute('/hello/@name', pageContext.urlPathname)
}
