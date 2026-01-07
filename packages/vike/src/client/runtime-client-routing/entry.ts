import '../assertEnvClient.js'

import { assertClientRouting } from '../../utils/assertRoutingType.js'
assertClientRouting()

import { initClientRouter } from './initClientRouter.js'
import { assertSingleInstance_onClientEntryClientRouting } from '../../utils/assertSingleInstance.js'
import { removeFoucBuster } from '../shared/removeFoucBuster.js'
import { setVirtualFileExportsGlobalEntry } from '../shared/getGlobalContextClientInternalShared.js'
// @ts-expect-error
import * as virtualFileExportsGlobalEntry from 'virtual:vike:global-entry:client:client-routing'

assertSingleInstance_onClientEntryClientRouting(import.meta.env.PROD)

setVirtualFileExportsGlobalEntry(virtualFileExportsGlobalEntry)

initClientRouter()

if (import.meta.env.DEV) removeFoucBuster()
