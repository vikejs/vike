import { assertServerRouting } from '../../utils/assertRoutingType.js'
assertServerRouting()

import {
  createPageContextClientSide,
  type PageContextCreatedClient_ServerRouting,
} from './createPageContextClientSide.js'
import { execHookOnRenderClient } from '../shared/execHookOnRenderClient.js'
import { assertSingleInstance_onClientEntryServerRouting, assertUsage, objectAssign, updateType } from './utils.js'
import { removeFoucBuster } from '../shared/removeFoucBuster.js'
import { execHook } from '../../shared-server-client/hooks/execHook.js'
import { preparePageContextForPublicUsageClient } from './preparePageContextForPublicUsageClient.js'
import { setVirtualFileExportsGlobalEntry } from '../shared/getGlobalContextClientInternalShared.js'
// @ts-expect-error
import * as virtualFileExportsGlobalEntry from 'virtual:vike:global-entry:client:server-routing'
import {
  loadPageConfigsLazyClientSide,
  type PageContext_loadPageConfigsLazyClientSide,
} from '../shared/loadPageConfigsLazyClientSide.js'
import { getPageContextSerializedInHtml } from '../shared/getJsonSerializedInHtml.js'
import { getCurrentUrl } from '../shared/getCurrentUrl.js'

const urlFirst = getCurrentUrl({ withoutHash: true })
assertSingleInstance_onClientEntryServerRouting(import.meta.env.PROD)
setVirtualFileExportsGlobalEntry(virtualFileExportsGlobalEntry)
if (import.meta.env.DEV) removeFoucBuster()
hydrate()

async function hydrate() {
  const pageContext = await createPageContextClientSide()

  objectAssign(pageContext, getPageContextSerializedInHtml())

  assertPristineUrl()

  // Sets pageContext.config to local configs (overrides the pageContext.config set above)
  updateType(pageContext, await loadPageConfigsLazyClientSideAndExecHook(pageContext))

  await execHookOnRenderClient(pageContext, preparePageContextForPublicUsageClient)
  await execHook('onHydrationEnd', pageContext, preparePageContextForPublicUsageClient)
}

async function loadPageConfigsLazyClientSideAndExecHook<
  PageContext extends PageContext_loadPageConfigsLazyClientSide & PageContextCreatedClient_ServerRouting,
>(pageContext: PageContext) {
  const pageContextAddendum = await loadPageConfigsLazyClientSide(
    pageContext.pageId,
    pageContext._pageFilesAll,
    pageContext._globalContext._pageConfigs,
    pageContext._globalContext._pageConfigGlobal,
  )
  objectAssign(pageContext, pageContextAddendum)

  await execHook('onCreatePageContext', pageContext, preparePageContextForPublicUsageClient)

  return pageContext
}

function assertPristineUrl() {
  const urlCurrent = getCurrentUrl({ withoutHash: true })
  assertUsage(
    urlFirst === urlCurrent,
    `The URL was manipulated before the hydration finished ('${urlFirst}' to '${urlCurrent}'). Ensure the hydration has finished before manipulating the URL. Consider using the onHydrationEnd() hook.`,
  )
}
