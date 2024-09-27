export { setPageContextCurrent }
export { getPageContextCurrent }
export { getPageContextCurrentAsync }

import { genPromise, getGlobalObject } from './utils.js'
import type { PageContextExports } from '../../shared/getPageFiles.js'

type PageContextCurrent = PageContextExports & {
  urlPathname: string
}
const globalObject = getGlobalObject(
  'getPageContextCurrent.ts',
  (() => {
    const { promise: pageContextCurrentPromise, resolve: pageContextCurrentPromiseResolve } =
      genPromise<PageContextCurrent>()
    return {
      pageContextCurrent: null as null | PageContextCurrent,
      pageContextCurrentPromise,
      pageContextCurrentPromiseResolve
    }
  })()
)

function getPageContextCurrent(): null | PageContextCurrent {
  const { pageContextCurrent } = globalObject
  return pageContextCurrent
}
// TODO/pageContext-prefetch: I think we can remove this? Once we use Vike's default if pageContextCurrent isn't defined yet.
async function getPageContextCurrentAsync(): Promise<PageContextCurrent> {
  const pageContextCurrent = await globalObject.pageContextCurrentPromise
  return pageContextCurrent
}
function setPageContextCurrent(pageContextCurrent: PageContextCurrent): void {
  globalObject.pageContextCurrent = pageContextCurrent
  globalObject.pageContextCurrentPromiseResolve(pageContextCurrent)
}
