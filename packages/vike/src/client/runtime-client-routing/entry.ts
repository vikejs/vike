import '../assertEnvClient.js'

import { assertClientRouting } from '../../utils/assertRoutingType.js'
assertClientRouting()

import { initClientRouter } from './initClientRouter.js'
import { assertSingleInstance_onClientEntryClientRouting } from '../../utils/assertSingleInstance.js'
import { removeFoucBuster } from '../shared/removeFoucBuster.js'

assertSingleInstance_onClientEntryClientRouting(import.meta.env.PROD)

initClientRouter()

if (import.meta.env.DEV) removeFoucBuster()
