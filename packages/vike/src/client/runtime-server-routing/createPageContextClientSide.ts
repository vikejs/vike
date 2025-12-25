export { createPageContextClientSide }
export type PageContextCreatedClient_ServerRouting = Awaited<ReturnType<typeof createPageContextClientSide>>

import { assertUsage, updateType, objectAssign } from './utils.js'
import { getPageContextSerializedInHtml } from '../shared/getJsonSerializedInHtml.js'
import { getCurrentUrl } from '../shared/getCurrentUrl.js'

import { createPageContextObject, createPageContextShared } from '../../shared-server-client/createPageContextShared.js'
import { getGlobalContextClientInternal } from './getGlobalContextClientInternal.js'

const urlFirst = getCurrentUrl({ withoutHash: true })

async function createPageContextClientSide() {
  const globalContext = await getGlobalContextClientInternal()

  const pageContextCreated = createPageContextObject()
  objectAssign(pageContextCreated, {
    isClientSide: true as const,
    isPrerendering: false as const,
    isHydration: true as const,
    _globalContext: globalContext,
    _pageFilesAll: globalContext._pageFilesAll, // TO-DO/next-major-release: remove
    isBackwardNavigation: null,
    isHistoryNavigation: null,
    _hasPageContextFromServer: true as const,
  })
  objectAssign(pageContextCreated, getPageContextSerializedInHtml())

  // Sets pageContext.config to global configs
  updateType(pageContextCreated, createPageContextShared(pageContextCreated, globalContext._globalConfigPublic))

  assertPristineUrl()
  return pageContextCreated
}

function assertPristineUrl() {
  const urlCurrent = getCurrentUrl({ withoutHash: true })
  assertUsage(
    urlFirst === urlCurrent,
    `The URL was manipulated before the hydration finished ('${urlFirst}' to '${urlCurrent}'). Ensure the hydration has finished before manipulating the URL. Consider using the onHydrationEnd() hook.`,
  )
}
