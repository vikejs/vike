export { extractLocale }

import { locales, localeDefault } from './locales'

function extractLocale(urlPathname) {
  const path = urlPathname.split('/')

  let locale
  let urlPathnameWithoutLocale
  // We remove the URL locale, for example `/de-DE/about` => `/about`
  const first = path[1]
  if (locales.filter((locale) => locale !== localeDefault).includes(first)) {
    locale = first
    urlPathnameWithoutLocale = '/' + path.slice(2).join('/')
  } else {
    locale = localeDefault
    urlPathnameWithoutLocale = urlPathname
  }

  return { locale, urlPathnameWithoutLocale }
}
