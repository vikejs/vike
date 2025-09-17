import { assertClientRouting } from '../../utils/assertRoutingType.js'
assertClientRouting()

import { initClientRouter } from './initClientRouter.js'
import { assertSingleInstance_onClientEntryClientRouting } from './utils.js'
import { removeFoucBuster } from '../shared/removeFoucBuster.js'
import { setVirtualFileExportsGlobalEntry } from '../shared/getGlobalContextClientInternalShared.js'
// @ts-expect-error
import * as virtualFileExportsGlobalEntry from 'virtual:vike:global-entry:client:client-routing'
// Ensure constants are loaded
// @ts-expect-error
import 'virtual:vike:constants'

assertSingleInstance_onClientEntryClientRouting(import.meta.env.PROD)

setVirtualFileExportsGlobalEntry(virtualFileExportsGlobalEntry)

initClientRouter()

if (import.meta.env.DEV) removeFoucBuster()
