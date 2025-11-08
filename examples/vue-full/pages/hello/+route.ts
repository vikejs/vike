// https://vike.dev/route
export { route }

import type { PageContextServer, PageContextClient } from 'vike/types'
import { resolveRoute } from 'vike/routing'
import { render } from 'vike/abort'
import { names } from './names'

// We use a Route Function to implement advanced routing logic
const route = (pageContext: PageContextServer | PageContextClient) => {
  if (pageContext.urlPathname === '/hello' || pageContext.urlPathname === '/hello/') {
    const name = 'anonymous'
    return { routeParams: { name } }
  }
  const result = resolveRoute('/hello/@name', pageContext.urlPathname)
  if (!result.match) return false
  const { name } = result.routeParams
  if (!names.includes(name)) {
    throw render(404, `Unknown name: ${name}.`)
  }
  return { routeParams: { name } }
}
