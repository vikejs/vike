import React from 'react'
import { usePageContext } from './usePageContext'
import { localeDefault } from '../locales'

export { Link }

function Link({ href, locale, ...props }) {
  const pageContext = usePageContext()
  locale = locale || pageContext.locale
  if (locale !== localeDefault) {
    href = '/' + locale + href
  }
  return <a href={href} {...props} />
}
