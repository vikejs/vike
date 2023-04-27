export default route

import { resolveRoute } from 'vite-plugin-ssr/routing'

// We can use Route Functions to implement advanced routing logic
function route(pageContext: { urlPathname: string }) {
  if (pageContext.urlPathname === '/hello' || pageContext.urlPathname === '/hello/') {
    const name = 'anonymous'
    return { routeParams: { name } }
  }
  return resolveRoute('/hello/@name', pageContext.urlPathname)
}
