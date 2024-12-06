import React from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { serializeSettings } from '../../serializeSettings'

export function Page() {
  const pageContext = usePageContext()
  const json = serializeSettings(pageContext)
  return <p id="serialized-settings">{json}</p>
}
