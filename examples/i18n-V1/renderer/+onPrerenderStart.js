export default onPrerenderStart

import { locales, localeDefault } from '../locales'

// We only need this for pre-rendered apps https://vite-plugin-ssr.com/pre-rendering
function onPrerenderStart(prerenderContext) {
  const pageContexts = []
  prerenderContext.pageContexts.forEach((pageContext) => {
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
  })
  return {
    prerenderContext: {
      pageContexts
    }
  }
}
