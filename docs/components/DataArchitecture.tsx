export { DataArchitecture }

import React from 'react'
import { assert } from '@brillout/docpress'
import { P, Link } from '@brillout/docpress'

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
  toolType: 'data-store' | 'graphql' | 'data-fetching'
  toolDocs: JSX.Element
}) {
  return (
    <>
      <DataRenderControl toolName={toolName} toolLink={toolLink} isGeneric={isGeneric} toolDocs={toolDocs} />
      <DataPassToClient toolType={toolType} isGenericDoc={isGeneric} toolName={toolName} />
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
        With Vike you have full control over rendering, data fetching, data management, and HTML streaming. Integrating{' '}
        {toolEl}
        {isGeneric ? ' you want' : ''} is mostly a matter of following its official SSR guide
        {toolDocs && <>: {toolDocs}</>}. (Vike saves you from "fighting the framework".)
      </p>
    </blockquote>
  )
}
function DataPassToClient({
  toolType,
  isGenericDoc,
  toolName
}: {
  toolType: 'data-store' | 'data-fetching' | 'graphql'
  isGenericDoc?: boolean
  toolName: string
}) {
  assert(toolType === 'data-store' || toolType === 'data-fetching' || toolType === 'graphql')
  assert(isGenericDoc === undefined || isGenericDoc === true || isGenericDoc === false)
  const dataName = toolType === 'data-store' ? 'state' : 'data'
  const pageContextName = toolType === 'data-store' ? 'initialStoreState' : 'initialData'
  return (
    <>
      {toolType === 'data-store' && (
        <p>
          When using a state management store such as {toolName}, your components don't access fetched data directly:
          your components can only access the store. The fetched data merely determines the initial state of the store.
        </p>
      )}
      {toolType === 'graphql' && (
        <p>
          When using a GraphQL tool such as {toolName}, you define GraphQL queries/fragments on a component-level, while
          fetching the GraphQL data in a single global hook (usually{' '}
          <Link href="/onBeforeRender">
            <code>onBeforeRender()</code>
          </Link>
          /
          <Link href="/onRenderHtml">
            <code>onRenderHtml()</code>
          </Link>
          /
          <Link href="/onRenderClient">
            <code>onRenderClient()</code>
          </Link>
          ).
        </p>
      )}
      <P>
        On a high-level, {isGenericDoc ? 'an' : 'the'} integration {isGenericDoc ? 'usually ' : ''}works like this:
        <ol>
          <li>
            You {toolType === 'data-store' ? 'set the initial state of the store' : 'fetch the initial data'} on the
            server-side. (You do it on the server-side so that the initial{' '}
            {toolType === 'data-store' ? 'state' : 'data'} is rendered to HTML.)
          </li>
          <li>
            You make the initial {dataName} available as <code>pageContext.{pageContextName}</code>.
          </li>
          <li>
            You make <code>pageContext.{pageContextName}</code> available on the client-side by adding{' '}
            <code>{`'${pageContextName}'`}</code> to <Link href="/passToClient" text={<code>passToClient</code>} />.
          </li>
          <li>
            You initialize {toolType === 'data-store' ? 'the store' : toolName.replace(/^any /, 'your ')} on the
            client-side using <code>pageContext.{pageContextName}</code>.
          </li>
        </ol>
      </P>
    </>
  )
}
