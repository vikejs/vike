import ReactDOMServer from 'react-dom/server'
import React from 'react'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import { Layout } from './Layout'

export { render }
export { passToClient }

const passToClient = ['routeParams']

function render(pageContext) {
  const { Page, routeParams } = pageContext
  const pageHtml = ReactDOMServer.renderToString(
    <Layout>
      <Page routeParams={routeParams} />
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
