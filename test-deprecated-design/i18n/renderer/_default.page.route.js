export { onBeforeRoute }

import { extractLocale } from '../locales'

function onBeforeRoute(pageContext) {
  const { urlWithoutLocale, locale } = extractLocale(pageContext.urlOriginal)
  return {
    pageContext: {
      locale,
      urlLogical: urlWithoutLocale,
    },
  }
}
