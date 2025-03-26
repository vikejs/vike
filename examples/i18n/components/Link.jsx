export { Link }

import React from 'react'
import { usePageContext } from '../renderer/usePageContext'
import { localeDefault } from '../locales'

function Link({ href, locale, ...props }) {
  const pageContext = usePageContext()
  locale = locale || pageContext.locale
  if (locale !== localeDefault) {
    href = '/' + locale + href
  }
  return <a href={href} {...props} />
}
