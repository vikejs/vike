export default (pageContext: { url: string }) => {
  const { url } = pageContext
  return {
    match: true,
    routeParams: {
      url
    }
  }
}
