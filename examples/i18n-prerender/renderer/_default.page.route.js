import { extractLocale } from '../locales'

export { onBeforeRoute }

function onBeforeRoute(pageContext) {
  let { url } = pageContext

  const { urlWithoutLocale, locale } = extractLocale(url)
  url = urlWithoutLocale

  return {
    pageContext: {
      // We make `locale` available as `pageContext.locale`.
      // We then use https://vite-plugin-ssr.com/pageContext-anywhere
      // to access `pageContext.locale` in any React/Vue component.
      locale,
      // We overwrite the original URL
      url,
    },
  }
}
