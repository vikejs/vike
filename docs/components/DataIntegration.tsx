export { DataIntegrationIntroGeneric }
export { DataIntegrationIntro }
export { DataIntegrationFetch }
export { DataIntegrationStore }

import React from 'react'
import { assert } from '@brillout/docpress'
import { Link } from '@brillout/docpress'
import { UiFrameworkExtension } from './UiFrameworkExtension'

function DataIntegrationIntroGeneric() {
  return (
    <>
      <DataIntegrationIntro>
        Some data-fetching tools allow you to fetch the initial data of the page on a component-level
      </DataIntegrationIntro>
      <p>Generally, on a high-level, the integration works in two steps:</p>
      <ol>
        <li>The initial data of a component is fetched while server-side rendering the component.</li>
        <li>
          The initial data is serialized and passed to the client. (So that the client uses the exact same data,
          avoiding double-fetching and hydration mismatches.)
        </li>
      </ol>
      <blockquote>
        <p>
          If <Link href="/ssr">SSR is disabled</Link>, then the data is only fetched on the client-side. (The data of a
          component is fetched where the component is loaded and executed.)
        </p>
      </blockquote>
      Depending on the tool, this integration is done (semi-)automatically. A fully manual integration can be done using
      Vike primitives:
    </>
  )
}

function DataIntegrationIntro({
  children,
  toolType,
  toolName
}: {
  children?: React.ReactNode
  toolName?: string
  toolType?: 'graphql' | 'data-store'
}) {
  const insteadOfDataHook = (
    <>
      instead of{' '}
      <Link href="/data-fetching#the-data-hook">
        using the page-level Vike hook <code>data()</code>
      </Link>
    </>
  )
  if (toolType === 'data-store') {
    return (
      <>
        <p>
          When using a state management store{toolName && ` such as ${toolName}`}, your components don't access fetched
          data directly: your components only access the store.
        </p>
        {/*
      <p>
        You can fetch the initial data of the page on component-level, {insteadOfDataHook}.
      </p>
      */}
      </>
    )
  }
  if (toolType === 'graphql') {
    return (
      <p>
        When using a GraphQL tool{toolName && ` such as ${toolName}`}, you can define GraphQL queries/fragments on a
        component-level, {insteadOfDataHook}.
      </p>
    )
  }
  assert(children)
  return (
    <>
      {children}, {insteadOfDataHook}.
    </>
  )
}

function DataIntegrationFetch({
  toolName
}: {
  toolName?: string
}) {
  return (
    <>
      <ol>
        <li>
          Fetch the initial SSR data on the server-side.
          <blockquote>
            <p>
              For example in{' '}
              <Link href="/onBeforeRender">
                <code>onBeforeRender()</code>
              </Link>
              , or{' '}
              <Link href="/onRenderHtml">
                <code>onRenderHtml()</code>
              </Link>{' '}
              if you don't use <UiFrameworkExtension name />.
            </p>
          </blockquote>
        </li>
        <li>
          Make the initial SSR data available as <code>pageContext.initialData</code>.
          <blockquote>
            <p>
              See <Link href="/pageContext#custom" />.
            </p>
          </blockquote>
        </li>
        <li>
          Make <code>pageContext.initialData</code> available on the client-side.
          <blockquote>
            <p>
              See <Link href="/passToClient" />.
            </p>
          </blockquote>
        </li>
        <li>
          Initialize {toolName || 'your data fetching tool'} on the client-side using{' '}
          <code>pageContext.initialData</code>.
          <blockquote>
            <p>
              For example in{' '}
              <Link href="/onBeforeRenderClient">
                <code>onBeforeRenderClient()</code>
              </Link>
              , or{' '}
              <Link href="/onRenderClient">
                <code>onRenderClient()</code>
              </Link>{' '}
              if you don't use <UiFrameworkExtension name />.
            </p>
          </blockquote>
        </li>
      </ol>
    </>
  )
}

function DataIntegrationStore({
  toolName,
  vue
}: {
  toolName?: string
  vue?: true
}) {
  return (
    <>
      <ol>
        {vue && (
          <li>
            Initialize {toolName || 'your data fetching tool'} with <code>app.use()</code> inside{' '}
            <Link href="/onCreateApp">
              <code>onCreateApp()</code>
            </Link>
            .
          </li>
        )}
        <li>
          Get the initial SSR state of the store and make it available as <code>pageContext.initialStoreState</code>.
          <blockquote>
            <p>
              For example in{' '}
              <Link href="/onAfterRenderHtml">
                <code>onAfterRenderHtml()</code>
              </Link>
              , or{' '}
              <Link href="/onRenderHtml">
                <code>onRenderHtml()</code>
              </Link>{' '}
              if you don't use <UiFrameworkExtension name />.
            </p>
            <p>
              See also: <Link href="/pageContext#custom" />.
            </p>
          </blockquote>
        </li>
        <li>
          Make <code>pageContext.initialStoreState</code> available on the client-side.
          <blockquote>
            <p>
              See <Link href="/passToClient" />.
            </p>
          </blockquote>
        </li>
        <li>
          Initialize {toolName || 'your data fetching tool'} on the client-side with{' '}
          <code>pageContext.initialStoreState</code>.
          <blockquote>
            <p>
              For example in{' '}
              <Link href="/onBeforeRenderClient">
                <code>onBeforeRenderClient()</code>
              </Link>
              , or{' '}
              <Link href="/onRenderClient">
                <code>onRenderClient()</code>
              </Link>{' '}
              if you don't use <UiFrameworkExtension name />.
            </p>
          </blockquote>
        </li>
      </ol>
    </>
  )
}
