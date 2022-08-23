export { onBeforeRoute }

import { extractLocale } from '../locales'

function onBeforeRoute(pageContext) {
  let urlMod = pageContext.urlOriginal

  const { urlWithoutLocale, locale } = extractLocale(urlMod)
  urlMod = urlWithoutLocale

  return {
    pageContext: {
      // We make `locale` available as `pageContext.locale`.
      // We then use https://vite-plugin-ssr.com/pageContext-anywhere
      // to access `pageContext.locale` in any React/Vue component.
      locale,
      // We overwrite the original URL
      urlOriginal: urlMod
    }
  }
}
