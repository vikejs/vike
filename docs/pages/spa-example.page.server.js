import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr'

export { render }

async function render(pageContext) {
  const pageAssets = await pageContext._getPageAssets()
  const scriptSrc = pageAssets.find((asset) => asset.assetType === 'script').src
  return escapeInject`<!DOCTYPE html>
<html>
  <!-- Note how this HTML does not contain \`Hello World\` -->
  <body>
    <div id='react-root'></div>
  </body>
  <script type="module" src="${dangerouslySkipEscape(scriptSrc)}"></script>
</html>`
}
