export { onRenderHtml }

import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import ReactDOMServer from 'react-dom/server'
import React from 'react'

type PageContext = {
  Page: () => React.ReactElement
}

function onRenderHtml(pageContext: PageContext) {
  const { Page } = pageContext
  const pageHtml = ReactDOMServer.renderToString(<Page />)
  return escapeInject`<html><body><div>${dangerouslySkipEscape(pageHtml)}</div></body></html>`
}
