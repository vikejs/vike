// https://vike.dev/onRenderHtml
export { onRenderHtml }

import { renderToStream } from 'react-streaming/server'
import React from 'react'
import { escapeInject } from 'vike/server'
import { Layout } from './Layout'
import { getPageTitle } from './getPageTitle'
import type { OnRenderHtmlAsync } from 'vike/types'

const onRenderHtml: OnRenderHtmlAsync = async (pageContext): ReturnType<OnRenderHtmlAsync> => {
  const { Page } = pageContext

  const stream = await renderToStream(
    <Layout pageContext={pageContext}>
      <Page />
    </Layout>,
    // We don't need react-streaming for this app. (We use it merely to showcase that Vike can handle react-streaming with a pre-rendered app. Note that using react-streaming with pre-rendering can make sense if we want to be able to use React's latest <Suspense> techniques.)
    { disable: true },
  )

  const title = getPageTitle(pageContext)

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
      </head>
      <body>
        <div id="root">${stream}</div>
      </body>
    </html>`

  return {
    documentHtml,
    // See https://vike.dev/streaming#initial-data-after-stream-end
    pageContext: async () => {
      return {
        someAsyncProps: 42,
      }
    },
  }
}
