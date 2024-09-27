export { setCurrentPageContext }
export { getPageContextCurrent }
export { getPageContextCurrentAwait }

import { getGlobalObject } from './utils.js'
import type { PageContextExports } from '../../shared/getPageFiles.js'

type PageContext = PageContextExports & {
  urlPathname: string
}
const globalObject = getGlobalObject('getPageContextCurrent.ts', {
  pageContext: null as null | PageContext,
  pageContextPromise: (() => {
    let resolve: (pageContext: PageContext) => void
    const promise = new Promise<PageContext>((r) => (resolve = r))
    return { promise, resolve: resolve! }
  })()
})

function getPageContextCurrent(): null | PageContext {
  return globalObject.pageContext
}
async function getPageContextCurrentAwait(): Promise<PageContext> {
  return globalObject.pageContextPromise.promise
}
function setCurrentPageContext(pageContext: PageContext): void {
  globalObject.pageContext = pageContext
  globalObject.pageContextPromise.resolve(pageContext)
}
