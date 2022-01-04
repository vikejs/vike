import ReactDOMServer from 'react-dom/server'
import React from 'react'
import { dangerouslySkipEscape } from 'vite-plugin-ssr'

export { render }

async function render(pageContext) {
  const { Page } = pageContext
  const pageHtml = ReactDOMServer.renderToString(<Page />)

  const pageAssets = await pageContext._getPageAssets()
  const scriptSrc = pageAssets.find((asset) => asset.assetType === 'script').src

  const documentHtml = dangerouslySkipEscape(`<!DOCTYPE html>
<html>
  <!-- Note how this HTML contains the page's text, such as "Is the page's text renderered to HTML?" -->
  <!-- This means that the text is visible for crawlers. -->
  <body>
    <div id="page-view">${pageHtml}</div>
    <script type="module" src="${scriptSrc}"></script>
  </body>
</html>`)

  return {
    documentHtml,
    pageContext: {
      _skipAssetInject: true,
    },
  }
}
