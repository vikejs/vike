import { assertClientRouting } from '../../utils/assertRoutingType.js'
assertClientRouting()

import { initClientRouter } from './initClientRouter.js'
import { assertSingleInstance_onClientEntryClientRouting } from './utils.js'
import { removeFoucBuster } from '../shared/removeFoucBuster.js'
import { setVirtualFileExportsGlobalEntry } from '../shared/createGetGlobalContextClient.js'
// @ts-expect-error
import * as virtualFileExportsGlobalEntry from 'virtual:vike:global-entry:client:client-routing'

// TODO/now: remove this ts-ignore
// @ts-ignore Since dist/cjs/client/ is never used, we can ignore this error.
const isProd: boolean = import.meta.env.PROD
assertSingleInstance_onClientEntryClientRouting(isProd)

setVirtualFileExportsGlobalEntry(virtualFileExportsGlobalEntry, true)

initClientRouter()

if (import.meta.env.DEV) removeFoucBuster()
