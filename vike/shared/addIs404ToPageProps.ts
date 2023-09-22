export { addIs404ToPageProps }

import { assert, assertWarning, hasProp, isObject } from './utils.js'
import { isErrorPage } from './error-page.js'
import type { PageConfig } from './page-configs/PageConfig.js'

function addIs404ToPageProps(pageContext: Record<string, unknown> & PageContextAssertIs404) {
  assertIs404(pageContext)
  addIs404(pageContext)
}

type PageContextAssertIs404 = { _pageId: string; _pageConfigs: PageConfig[] }
function assertIs404(pageContext: PageContextAssertIs404) {
  if (isErrorPage(pageContext._pageId, pageContext._pageConfigs)) {
    assert(hasProp(pageContext, 'is404', 'boolean'))
  }
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
