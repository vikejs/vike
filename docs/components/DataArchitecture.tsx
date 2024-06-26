export { DataArchitecture }

import React from 'react'
import { assert } from '@brillout/docpress'
import { P, Link } from '@brillout/docpress'

function DataArchitecture({
  toolName,
  toolType
}: {
  toolName?: string
  toolType: 'data-store' | 'graphql' | 'data-fetching'
}) {
  assert(toolType === 'data-store' || toolType === 'data-fetching' || toolType === 'graphql')
  const isGenericDoc = !toolName
  const dataName = toolType === 'data-store' ? 'state' : 'data'
  const pageContextName = toolType === 'data-store' ? 'initialStoreState' : 'initialData'
  return (
    <>
      {toolType === 'data-store' && (
        <p>
          When using a state management store{toolName && ` such as ${toolName}`}, your components don't access fetched
          data directly: your components only access the store. Fetched data merely determines the initial state of the
          store.
        </p>
      )}
      {toolType === 'graphql' && (
        <p>
          When using a GraphQL tool{toolName && ` such as ${toolName}`}, you define GraphQL queries/fragments on a
          component-level, while fetching the GraphQL data in one global hook common to all pages (usually{' '}
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
            You initialize {toolType === 'data-store' ? 'the store' : toolName || 'your data fetching tool'} on the
            client-side using <code>pageContext.{pageContextName}</code>.
          </li>
        </ol>
      </P>
    </>
  )
}
