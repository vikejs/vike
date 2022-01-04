import { dangerouslySkipEscape } from 'vite-plugin-ssr'

export async function render(pageContext) {
  const pageAssets = await pageContext._getPageAssets()
  const scriptSrc = pageAssets.find((asset) => asset.assetType === 'script').src

  const documentHtml = dangerouslySkipEscape(`<!DOCTYPE html>
<html>
  <!-- Note how this HTML does not contain the page's text, such as "Is the page's text renderered to HTML?" -->
  <!-- This means that the text is not visible for crawlers. -->
  <body>
    <div id="page-view"></div>
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
