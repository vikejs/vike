// https://vike.dev/route
export { route }

import { resolveRoute } from 'vike/routing'

const route = (pageContext) => {
  if (pageContext.urlPathname === '/starship' || pageContext.urlPathname === '/starship/') {
    return { routeParams: { view: 'overview' } }
  }
  const result = resolveRoute('/starship/@view', pageContext.urlPathname)
  if (!['reviews', 'spec'].includes(result.routeParams.view)) {
    return false
  }
  return result
}
