export { getPageTitle }

import type { PageContext } from 'vike/types'

function getPageTitle(pageContext: PageContext): string {
  const title =
    // Title defined dynamically by onBeforeRender()
    pageContext.title ||
    // Title defined statically by /pages/some-page/+title.js (or by `export default { title }` in /pages/some-page/+config.js)
    // The config 'pageContext.config.title' is a custom config we defined at ./+config.ts
    pageContext.config.title ||
    'Demo'
  return title
}
