import { resolveRoute } from 'vite-plugin-ssr/routing'

export default (pageContext) => {
  if (pageContext.urlPathname === '/starship' || pageContext.urlPathname === '/starship/') {
    return { routeParams: { view: 'overview' } }
  }
  const result = resolveRoute('/starship/@view', pageContext.urlPathname)
  if (!['reviews', 'spec'].includes(result.routeParams.view)) {
    return false
  }
  return result
}
