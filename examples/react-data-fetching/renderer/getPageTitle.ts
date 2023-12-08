export { getPageTitle }

import type { PageContext } from 'vike/types'
import type { GlobalData } from './PageContext'

function getPageTitle(pageContext: PageContext): string {
  const title =
    // Title defined dynamically by the data() hook
    (pageContext.data as GlobalData)?.title ||
    // Title defined statically by /pages/some-page/+title.js (or by `export default { title }` in /pages/some-page/+config.js)
    // The config 'pageContext.config.title' is a custom config we defined at ./+config.ts
    pageContext.config.title ||
    'Demo'
  return title
}
