export { setCurrentPageContext }
export { getCurrentPageContext }
export { getCurrentPageContextAwait }

import { getGlobalObject } from './utils.js'

type PageContext = {
  exports: Record<string, unknown>
  urlPathname: string
}
const globalObject = getGlobalObject('getCurrentPageContext.ts', {
  pageContext: null as null | PageContext,
  pageContextPromise: (() => {
    let resolve: (pageContext: PageContext) => void
    const promise = new Promise<PageContext>((r) => (resolve = r))
    return { promise, resolve: resolve! }
  })()
})

function getCurrentPageContext(): null | PageContext {
  return globalObject.pageContext
}
async function getCurrentPageContextAwait(): Promise<PageContext> {
  return globalObject.pageContextPromise.promise
}
function setCurrentPageContext(pageContext: PageContext): void {
  globalObject.pageContext = pageContext
  globalObject.pageContextPromise.resolve(pageContext)
}
