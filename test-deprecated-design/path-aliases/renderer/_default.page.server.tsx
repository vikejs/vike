export { render }

import ReactDOMServer from 'react-dom/server'
import React from 'react'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import { Layout } from './Layout'
import type { PageContext } from '#root/types'

function render(pageContext: PageContext) {
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
