export { setPageContextCurrent }
export { getPageContextCurrent }

import { getGlobalObject } from './utils.js'
import type { PageConfigsUserFriendly } from '../../shared/getPageFiles.js'

type PageContextCurrent = PageConfigsUserFriendly & {
  urlPathname: string
}
const globalObject = getGlobalObject('getPageContextCurrent.ts', {
  pageContextCurrent: null as null | PageContextCurrent
})

function getPageContextCurrent(): null | PageContextCurrent {
  const { pageContextCurrent } = globalObject
  return pageContextCurrent
}
function setPageContextCurrent(pageContextCurrent: PageContextCurrent): void {
  globalObject.pageContextCurrent = pageContextCurrent
}
