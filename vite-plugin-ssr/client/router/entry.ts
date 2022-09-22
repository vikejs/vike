import './pageFiles'
import { assertIsBundledOnce } from './utils'
import { useClientRouter } from './useClientRouter'

if (import.meta.env.PROD) assertIsBundledOnce()
useClientRouter()
