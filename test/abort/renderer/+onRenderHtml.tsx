export default onRenderHtml

import ReactDOMServer from 'react-dom/server'
import React from 'react'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import { Layout } from './Layout'
import { assert } from '../utils/assert'
import type { PageContextServer } from './types'

function onRenderHtml(pageContext: PageContextServer) {
  assert(Array.isArray(pageContext.pageContextsAborted))

  const { Page } = pageContext
  const pageHtml = ReactDOMServer.renderToString(
    <Layout pageContext={pageContext}>
      <Page />
    </Layout>,
  )

  return escapeInject`<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
      </head>
      <body>
        <div id="root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}
