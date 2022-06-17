export default (pageContext) => {
  let [path1, path2] = pageContext.url.split('/').filter(Boolean)
  path2 = path2 || ''
  if (path1 === 'starship') {
    let innerRoute
    if (path2 === '') {
      innerRoute = 'overview'
    }
    for (const innerRoute_ of ['reviews', 'spec']) {
      if (path2 === innerRoute_) {
        innerRoute = innerRoute_
      }
    }
    if (innerRoute) {
      return { routeParams: { innerRoute } }
    }
  }
  return false
}
