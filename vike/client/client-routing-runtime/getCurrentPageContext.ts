export { getCurrentPageContext }
export { setCurrentPageContext }

import { getGlobalObject } from './utils.js'

type PageContext = {
  exports: Record<string, unknown>
  urlPathname: string
}
const globalObject = getGlobalObject('getCurrentPageContext.ts', {
  pageContext: null as null | PageContext
})

function getCurrentPageContext(): null | PageContext {
  return globalObject.pageContext
}
function setCurrentPageContext(pageContext: PageContext): void {
  globalObject.pageContext = pageContext
}
