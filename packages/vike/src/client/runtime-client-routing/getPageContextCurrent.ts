import '../assertEnvClient.js'

export { setPageContextCurrent }
export { getPageContextCurrent }

import { getGlobalObject } from '../../utils/getGlobalObject.js'
import type { PageContextConfig } from '../../shared-server-client/getPageFiles.js'

type PageContextCurrent = PageContextConfig & {
  urlPathname: string
}
const globalObject = getGlobalObject('runtime-client-routing/getPageContextCurrent.ts', {
  pageContextCurrent: null as null | PageContextCurrent,
})

function getPageContextCurrent(): null | PageContextCurrent {
  const { pageContextCurrent } = globalObject
  return pageContextCurrent
}
function setPageContextCurrent(pageContextCurrent: PageContextCurrent): void {
  globalObject.pageContextCurrent = pageContextCurrent
}
