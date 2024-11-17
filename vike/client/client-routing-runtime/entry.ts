import { assertClientRouting } from '../../utils/assertRoutingType'
assertClientRouting()

import './pageFiles'
import { initClientRouter } from './initClientRouter'
import { assertSingleInstance_onClientEntryClientRouting } from './utils'
import { removeFoucBuster } from '../shared/removeFoucBuster'
// @ts-ignore Since dist/cjs/client/ is never used, we can ignore this error.
const isProd: boolean = import.meta.env.PROD
assertSingleInstance_onClientEntryClientRouting(isProd)

if (import.meta.env.DEV) removeFoucBuster()

initClientRouter()
