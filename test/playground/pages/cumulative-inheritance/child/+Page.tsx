import React from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { serializePageContext } from '../serializePageContext'

export function Page() {
  const pageContext = usePageContext()
  const json = serializePageContext(pageContext)
  return (
    <div>
      <h1>Cumulative Inheritance Test - Child</h1>
      <p id="serialized-settings">{json}</p>
    </div>
  )
}
