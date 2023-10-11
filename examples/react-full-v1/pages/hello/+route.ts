export { route }

import type { Config, PageContextClient, PageContextServer } from 'vike/types'
import { resolveRoute } from 'vike/routing'

// Route Functions enables advanced routing logic
const route: Config['route'] = (
  pageContext: PageContextServer | PageContextClient
): { routeParams: Record<string, string> } => {
  if (pageContext.urlPathname === '/hello' || pageContext.urlPathname === '/hello/') {
    const name = 'anonymous'
    return { routeParams: { name } }
  }
  return resolveRoute('/hello/@name', pageContext.urlPathname)
}
