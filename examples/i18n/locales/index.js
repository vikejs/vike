import { translations } from './translations.js'
export { extractLocale }
export { translate }
export { locales }
export { localeDefault }

const locales = ['en-US', 'de-DE', 'fr-FR']
const localeDefault = locales[0]

function extractLocale(url) {
  const urlPaths = url.split('/')

  let locale
  let urlWithoutLocale
  // We remove the URL locale, for example `/de-DE/about` => `/about`
  const firstPath = urlPaths[1]
  if (locales.filter((locale) => locale !== localeDefault).includes(firstPath)) {
    locale = firstPath
    urlWithoutLocale = '/' + urlPaths.slice(2).join('/')
  } else {
    locale = localeDefault
    urlWithoutLocale = url
  }

  return { locale, urlWithoutLocale }
}

function translate(text, locale) {
  if (locale === localeDefault) {
    return text
  }
  return translations[text][locale]
}
