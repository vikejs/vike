export { setPageContextCurrent }
export { getPageContextCurrent }
export { getPageContextCurrentAsync }

import { getGlobalObject } from './utils.js'
import type { PageContextExports } from '../../shared/getPageFiles.js'

type PageContextCurrent = PageContextExports & {
  urlPathname: string
}
const globalObject = getGlobalObject('getPageContextCurrent.ts', {
  pageContextCurrent: null as null | PageContextCurrent,
  pageContextCurrentPromise: (() => {
    let resolve: (pageContextCurrent: PageContextCurrent) => void
    const promise = new Promise<PageContextCurrent>((r) => (resolve = r))
    return { promise, resolve: resolve! }
  })()
})

function getPageContextCurrent(): null | PageContextCurrent {
  return globalObject.pageContextCurrent
}
async function getPageContextCurrentAsync(): Promise<PageContextCurrent> {
  return globalObject.pageContextCurrentPromise.promise
}
function setPageContextCurrent(pageContextCurrent: PageContextCurrent): void {
  globalObject.pageContextCurrent = pageContextCurrent
  globalObject.pageContextCurrentPromise.resolve(pageContextCurrent)
}
