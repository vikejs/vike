export default onBeforeRoute

import { extractLocale } from '../locales'
import { modifyUrl } from 'vike/modifyUrl'

function onBeforeRoute(pageContext) {
  const url = pageContext.urlParsed
  const { urlPathnameWithoutLocale, locale } = extractLocale(url.pathname)
  const urlLogical = modifyUrl(url.href, { pathname: urlPathnameWithoutLocale })
  return {
    pageContext: {
      // Make `locale` available as pageContext.locale
      locale,
      // Vike's router will use pageContext.urlLogical instead of pageContext.urlOriginal
      urlLogical
    }
  }
}
