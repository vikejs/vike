import React from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { serializePageContext } from './serializePageContext'

export function Page() {
  const pageContext = usePageContext()
  const json = serializePageContext(pageContext)
  return <p id="serialized-settings">{json}</p>
}
