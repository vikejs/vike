import '../assertEnvClient.js'

import { assertServerRouting } from '../../utils/assertRoutingType.js'
assertServerRouting()

import { createPageContextClient } from './createPageContextClient.js'
import { execHookOnRenderClient } from '../shared/execHookOnRenderClient.js'
import { assertUsage } from '../../utils/assert.js'
import { assertSingleInstance_onClientEntryServerRouting } from '../../utils/assertSingleInstance.js'
import { objectAssign } from '../../utils/objectAssign.js'
import { removeFoucBuster } from '../shared/removeFoucBuster.js'
import { execHook } from '../../shared-server-client/hooks/execHook.js'
import { getPageContextPublicClient } from './getPageContextPublicClient.js'
import { setVirtualFileExportsGlobalEntry } from '../shared/getGlobalContextClientInternalShared.js'
// @ts-expect-error
import * as virtualFileExportsGlobalEntry from 'virtual:vike:global-entry:client:server-routing'
import { loadPageConfigsLazyClientSide } from '../shared/loadPageConfigsLazyClientSide.js'
import { getPageContextSerializedInHtml } from '../shared/getJsonSerializedInHtml.js'
import { getCurrentUrl } from '../shared/getCurrentUrl.js'

const urlFirst = getCurrentUrl({ withoutHash: true })
assertSingleInstance_onClientEntryServerRouting(import.meta.env.PROD)
setVirtualFileExportsGlobalEntry(virtualFileExportsGlobalEntry)
if (import.meta.env.DEV) removeFoucBuster()
hydrate()

async function hydrate() {
  const pageContext = await createPageContextClient()

  objectAssign(pageContext, getPageContextSerializedInHtml())

  // Sets pageContext.config using non-global configs — overrides the pageContext.config set using global configs at createPageContextClient()
  const pageContextAddendum = await loadPageConfigsLazyClientSide(
    pageContext.pageId,
    pageContext._pageFilesAll,
    pageContext._globalContext._pageConfigs,
    pageContext._globalContext._pageConfigGlobal,
  )
  objectAssign(pageContext, pageContextAddendum)

  await execHook('onCreatePageContext', pageContext, getPageContextPublicClient)

  assertPristineUrl()

  await execHookOnRenderClient(pageContext, getPageContextPublicClient)

  await execHook('onHydrationEnd', pageContext, getPageContextPublicClient)
}

function assertPristineUrl() {
  const urlCurrent = getCurrentUrl({ withoutHash: true })
  assertUsage(
    urlFirst === urlCurrent,
    `The URL was manipulated before the hydration finished ('${urlFirst}' to '${urlCurrent}'). Ensure the hydration has finished before manipulating the URL. Consider using the onHydrationEnd() hook.`,
  )
}
