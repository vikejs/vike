export { onBeforeRoute }

import { extractLocale } from '../locales'

function onBeforeRoute(pageContext) {
  const { urlWithoutLocale, locale } = extractLocale(pageContext.urlOriginal)
  return {
    pageContext: {
      // We make `locale` available as `pageContext.locale`. We can then use https://vite-plugin-ssr.com/pageContext-anywhere to access pageContext.locale in any React/Vue component.
      locale,
      // We overwrite the original URL
      urlOriginal: urlWithoutLocale
    }
  }
}
