export default route

import { resolveRoute } from 'vite-plugin-ssr/routing'

// Route Functions enables advanced routing logic
function route(pageContext: { urlPathname: string }) {
  if (pageContext.urlPathname === '/hello' || pageContext.urlPathname === '/hello/') {
    const name = 'anonymous'
    return { routeParams: { name } }
  }
  return resolveRoute('/hello/@name', pageContext.urlPathname)
}
