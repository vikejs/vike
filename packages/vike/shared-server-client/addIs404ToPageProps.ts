export { addIs404ToPageProps }

import { assertWarning, isObject } from './utils.js'

function addIs404ToPageProps(pageContext: Record<string, unknown>) {
  addIs404(pageContext)
}

function addIs404(pageContext: Record<string, unknown>) {
  if (pageContext.is404 === undefined || pageContext.is404 === null) return
  const pageProps = pageContext.pageProps || {}
  if (!isObject(pageProps)) {
    assertWarning(false, 'pageContext.pageProps should be an object', { showStackTrace: true, onlyOnce: true })
    return
  }
  pageProps.is404 = pageProps.is404 || pageContext.is404
  pageContext.pageProps = pageProps
}
