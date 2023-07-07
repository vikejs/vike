export default route

import { resolveRoute } from 'vite-plugin-ssr/routing'
import { renderErrorPage } from 'vite-plugin-ssr/abort'
import { names } from './names'

// We use a Route Function to implement advanced routing logic
function route(pageContext: { urlPathname: string }) {
  if (pageContext.urlPathname === '/hello' || pageContext.urlPathname === '/hello/') {
    const name = 'anonymous'
    return { routeParams: { name } }
  }
  const result = resolveRoute('/hello/@name', pageContext.urlPathname)
  if (!result.match) return false
  const { name } = result.routeParams
  if (!names.includes(name)) {
    throw renderErrorPage(404, `Unknown name: ${name}.`)
  }
  return { routeParams: { name } }
}
