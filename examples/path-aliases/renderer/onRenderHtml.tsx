// https://vike.dev/onRenderHtml
export { onRenderHtml }

import ReactDOMServer from 'react-dom/server'
import React from 'react'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import { Layout } from './Layout'
import type { PageContextServer } from 'vike/types'

const onRenderHtml = async (pageContext: PageContextServer) => {
  const { Page } = pageContext
  const pageHtml = ReactDOMServer.renderToString(
    <Layout>
      <Page />
    </Layout>,
  )
  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}
