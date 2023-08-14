import { assertClientRouting } from '../../utils/assertRoutingType.mjs'
assertClientRouting()

import './pageFiles'
import { useClientRouter } from './useClientRouter.mjs'
import { onClientEntry_ClientRouting } from './utils.mjs'
onClientEntry_ClientRouting(import.meta.env.PROD)

useClientRouter()
