export { onBeforeRoute }

import type { PageContext } from 'vike/types'

function onBeforeRoute(pageContext: PageContext) {
  console.log('+onBeforeRoute', pageContext.urlPathname)
}
