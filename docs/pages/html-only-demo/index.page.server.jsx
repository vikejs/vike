import ReactDOMServer from 'react-dom/server'
import React from 'react'
import { dangerouslySkipEscape } from 'vite-plugin-ssr'

export { render }

function render(pageContext) {
  const { Page } = pageContext
  const pageHtml = ReactDOMServer.renderToString(<Page />)
  const documentHtml = dangerouslySkipEscape(`<!DOCTYPE html>
<html>
  <!-- Note how this HTML contains the page's text, such as "Is the page's text renderered to HTML?" -->
  <!-- This means that the text is visible for crawlers. -->
  <body>
    <div>${pageHtml}</div>
  </body>
</html>`)

  return {
    documentHtml,
    pageContext: {
      _skipAssetInject: true,
    },
  }
}
