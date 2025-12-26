export { onBeforeRoute }

import type { PageContext } from 'vike/types'

// TEST: +onHookCall with +onBeforeRoute
function onBeforeRoute(pageContext: PageContext) {
  /*
  console.log('+onBeforeRoute', pageContext.urlPathname)
  //*/
}
