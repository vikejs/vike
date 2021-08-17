import React from 'react'
import { assert } from 'libframe-docs/utils'

export { DataRenderControl, DataPassToClient }

function DataRenderControl({ toolName, toolLink }: { toolName: string; toolLink?: string }) {
  assert(toolName)
  const toolEl = toolLink ? <a href={toolLink}>{toolName}</a> : toolName
  return (
    <p>
      With <code>vite-plugin-ssr</code> we keep control over our app architecture and how our pages are rendered. This
      allows us to integrate {toolEl} simply by following its official SSR docs.
    </p>
  )
}
function DataPassToClient({ toolType, isGenericDoc }: { toolType: string; isGenericDoc?: true }) {
  assert(toolType === 'data-store' || toolType === 'data-fetching')
  let text = ''
  if (isGenericDoc) {
    text += 'Typically, the'
  } else {
    text += 'The'
  }
  text += ' '
  if (toolType === 'data-store') {
    text += 'initial state of the store is set'
  } else {
    text += 'initial data is fetched'
  }
  assert(isGenericDoc === undefined || isGenericDoc === true)
  const dataName = toolType === 'data-store' ? 'state' : 'data'
  return (
    <p>
      {text} on the server (its content is server-side rendered). This initial {dataName} is then passed onto the
      browser for <a href="/hydration">hydration</a>; we can use
      <a href="/passToClient">
        <code>passToClient</code>
      </a>{' '}
      for that purpose.
    </p>
  )
}
