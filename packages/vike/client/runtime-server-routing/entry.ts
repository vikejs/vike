import { assertServerRouting } from '../../utils/assertRoutingType.js'
assertServerRouting()

import { createPageContextClientSide } from './createPageContextClientSide.js'
import { execHookOnRenderClient } from '../shared/execHookOnRenderClient.js'
import { assertSingleInstance_onClientEntryServerRouting } from './utils.js'
import { removeFoucBuster } from '../shared/removeFoucBuster.js'
import { execHook } from '../../shared/hooks/execHook.js'
import { preparePageContextForPublicUsageClient } from './preparePageContextForPublicUsageClient.js'
import { setVirtualFileExportsGlobalEntry } from '../shared/getGlobalContextClientInternalShared.js'
// @ts-expect-error
import * as virtualFileExportsGlobalEntry from 'virtual:vike:global-entry:client:server-routing'

assertSingleInstance_onClientEntryServerRouting(import.meta.env.PROD)

setVirtualFileExportsGlobalEntry(virtualFileExportsGlobalEntry, false)

if (import.meta.env.DEV) removeFoucBuster()

hydrate()

async function hydrate() {
  const pageContext = await createPageContextClientSide()
  await execHookOnRenderClient(pageContext, preparePageContextForPublicUsageClient)
  await execHook('onHydrationEnd', pageContext, preparePageContextForPublicUsageClient)
}
