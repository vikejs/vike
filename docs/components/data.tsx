import React from 'react'
import { assert } from 'libframe-docs/utils'

export { DataRenderControl, DataPassToClient }

function DataRenderControl({
  toolName,
  toolLink,
  isGeneric,
}: {
  toolName: string
  toolLink?: string
  isGeneric: boolean
}) {
  assert(toolName)
  const toolEl = toolLink ? <a href={toolLink}>{toolName}</a> : toolName
  assert(isGeneric === toolName.startsWith('any '))
  assert(isGeneric === !toolLink)
  return (
    <blockquote>
      With <code>vite-plugin-ssr</code> we keep control over app architecture;
      {isGeneric ? 'usually, ' : ''}we can integrate {toolEl} simply by following its official SSR docs.
    </blockquote>
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
      browser for <a href="/hydration">hydration</a>; we can use{' '}
      <a href="/passToClient">
        <code>passToClient</code>
      </a>{' '}
      for that purpose.
    </p>
  )
}
