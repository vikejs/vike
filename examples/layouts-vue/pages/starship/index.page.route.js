export default (pageContext) => {
  let [base, innerRoute] = pageContext.url.split('/').filter(Boolean)
  if (base !== 'starship') {
    return false
  }
  innerRoute = innerRoute || 'overview'
  if (!['overview', 'reviews', 'spec'].includes(innerRoute)) {
    return false
  }
  return { routeParams: { innerRoute } }
}
