import { setIsClientSideRouter } from '../../utils/isClientSideRouter'
setIsClientSideRouter()

import './pageFiles'
import { useClientRouter } from './useClientRouter'
import { onClientEntry_ClientRouting } from './utils'
onClientEntry_ClientRouting(import.meta.env.PROD)

useClientRouter()
