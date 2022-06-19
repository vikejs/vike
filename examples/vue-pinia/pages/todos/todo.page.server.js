export function onBeforeRender(pageContext) {
  return {
    pageContext: {
      pageProps: pageContext.routeParams,
    },
  }
}
