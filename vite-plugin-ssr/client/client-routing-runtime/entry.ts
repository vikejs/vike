import { assertClientRouting } from '../../utils/assertRoutingType.js'
assertClientRouting()

import './pageFiles'
import { useClientRouter } from './useClientRouter.js'
import { onClientEntry_ClientRouting } from './utils.js'
const isProd: boolean = import.meta.env.PROD
onClientEntry_ClientRouting(isProd)

useClientRouter()
