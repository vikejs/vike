import { assertClientRouting } from '../../utils/assertRoutingType.mjs'
assertClientRouting()

import './pageFiles'
import { useClientRouter } from './useClientRouter.mjs'
import { onClientEntry_ClientRouting } from './utils.mjs'
const isProd: boolean = import.meta.env.PROD
onClientEntry_ClientRouting(isProd)

useClientRouter()
