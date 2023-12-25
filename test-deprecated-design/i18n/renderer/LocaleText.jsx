export { LocaleText }

import React from 'react'
import { usePageContext } from './usePageContext'
import { translate } from '../locales'

function LocaleText({ children }) {
  const pageContext = usePageContext()
  const { locale } = pageContext
  const text = children
  const textLocalized = translate(text, locale)
  return <>{textLocalized}</>
}
