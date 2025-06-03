export { setPageContextCurrent }
export { getPageContextCurrent }

import { getGlobalObject } from './utils.js'
import type { PageConfigUserFriendlyOld } from '../../shared/getPageFiles.js'

type PageContextCurrent = PageConfigUserFriendlyOld & {
  urlPathname: string
}
const globalObject = getGlobalObject('runtime-client-routing/getPageContextCurrent.ts', {
  pageContextCurrent: null as null | PageContextCurrent
})

function getPageContextCurrent(): null | PageContextCurrent {
  const { pageContextCurrent } = globalObject
  return pageContextCurrent
}
function setPageContextCurrent(pageContextCurrent: PageContextCurrent): void {
  globalObject.pageContextCurrent = pageContextCurrent
}
