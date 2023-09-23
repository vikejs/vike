export { DataArchitecture }

import React from 'react'
import { assert } from '@brillout/docpress'
import { P, Link, ReadingRecommendation } from '@brillout/docpress'

function DataArchitecture({
  toolName,
  toolLink,
  isGeneric,
  toolType,
  toolDocs
}: {
  toolName: string
  toolLink?: string
  isGeneric: boolean
  toolType: 'data-store' | 'data-fetching'
  toolDocs: JSX.Element
}) {
  const recommendation = <ReadingRecommendation tour={true} links={['/data-fetching']} />
  return (
    <>
      <DataRenderControl toolName={toolName} toolLink={toolLink} isGeneric={isGeneric} toolDocs={toolDocs} />
      {recommendation}
      {<DataPassToClient toolType={toolType} isGenericDoc={isGeneric} toolName={toolName} />}
    </>
  )
}

function DataRenderControl({
  toolName,
  toolLink,
  isGeneric,
  toolDocs
}: {
  toolName: string
  toolLink?: string
  isGeneric: boolean
  toolDocs: JSX.Element
}) {
  assert([true, false].includes(isGeneric), { isGeneric, isGenericType: typeof isGeneric })
  assert(toolName)
  assert(isGeneric === toolName.startsWith('any '), { isGeneric, toolName, toolLink })
  assert(isGeneric === !toolLink, { isGeneric, toolName, toolLink })
  const toolEl = toolLink ? <a href={toolLink}>{toolName}</a> : toolName
  return (
    <blockquote>
      <p>
        With Vike we keep control over our app architecture; we can integrate {toolEl}
        {isGeneric ? ' we want' : ''} simply by following its SSR docs.
      </p>
      {toolDocs && (
        <ul>
          <li>{toolDocs}</li>
        </ul>
      )}
    </blockquote>
  )
}
function DataPassToClient({
  toolType,
  isGenericDoc,
  toolName
}: {
  toolType: 'data-store' | 'data-fetching'
  isGenericDoc?: boolean
  toolName: string
}) {
  assert(toolType === 'data-store' || toolType === 'data-fetching')
  assert(isGenericDoc === undefined || isGenericDoc === true || isGenericDoc === false)
  const dataName = toolType === 'data-store' ? 'state' : 'data'
  const pageContextName = toolType === 'data-store' ? 'initialStoreState' : 'initialData'
  return (
    <P>
      On a high-level, {isGenericDoc ? 'an' : 'the'} SSR integration {isGenericDoc ? 'usually ' : ''}works like this:
      <ol>
        <li>
          We {toolType === 'data-store' ? 'set the initial state of the store' : 'fetch the initial data'} on the
          server-side. (We do it on the server-side so that the initial {toolType === 'data-store' ? 'state' : 'data'}{' '}
          is rendered to HTML.)
        </li>
        <li>
          We make the initial {dataName} available as <code>pageContext.{pageContextName}</code>.
        </li>
        <li>
          We make <code>pageContext.{pageContextName}</code> available on the browser-side by adding{' '}
          <code>{`'${pageContextName}'`}</code> to <Link href="/passToClient" text={<code>passToClient</code>} />.
        </li>
        <li>
          We initialize {toolType === 'data-store' ? 'the store' : toolName} on the browser-side using{' '}
          <code>pageContext.{pageContextName}</code>.
        </li>
      </ol>
    </P>
  )
}
