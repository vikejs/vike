// https://vike.dev/onPrerenderStart
export default onPrerenderStart

import { locales, localeDefault } from '../locales'

// We only need this for pre-rendered apps https://vike.dev/pre-rendering
function onPrerenderStart(prerenderContext) {
  const pageContexts = []
  prerenderContext.pageContexts.forEach((pageContext) => {
    duplicateWithLocale(pageContext, pageContexts)
  })
  return {
    prerenderContext: {
      pageContexts
    }
  }
}

function duplicateWithLocale(pageContext, pageContexts) {
  // Duplicate pageContext for each locale
  locales.forEach((locale) => {
    // Localize URL
    let { urlOriginal } = pageContext
    if (locale !== localeDefault) {
      urlOriginal = `/${locale}${pageContext.urlOriginal}`
    }
    pageContexts.push({
      ...pageContext,
      urlOriginal,
      // Set pageContext.locale
      locale
    })
  })
}
