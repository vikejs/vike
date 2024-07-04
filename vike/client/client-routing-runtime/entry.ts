import { assertClientRouting } from '../../utils/assertRoutingType.js'
assertClientRouting()

import './pageFiles'
import { installClientRouter } from './installClientRouter.js'
import { assertSingleInstance_onClientEntryClientRouting } from './utils.js'
import { removeFoucBuster } from '../shared/removeFoucBuster.js'
// @ts-ignore Since dist/cjs/client/ is never used, we can ignore this error.
const isProd: boolean = import.meta.env.PROD
assertSingleInstance_onClientEntryClientRouting(isProd)

if (import.meta.env.DEV) removeFoucBuster()

installClientRouter()
