import { escapeInjections } from 'vite-plugin-ssr'

export { render }

async function render(pageContext) {
  const scriptSrc = pageContext._pageAssets.find((asset) => asset.assetType === 'script').src
  return escapeInjections.dangerouslySkipEscape(`<!DOCTYPE html>
<html>
  <!-- Note how this HTML does not contain \`Hello World\` -->
  <body>
    <div id='react-root'></div>
  </body>
  <script type="module" src="${scriptSrc}"></script>
</html>`)
}
