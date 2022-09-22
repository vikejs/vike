import './pageFiles'
import { assertIsBundledOnce } from './utils'
import { useClientRouter } from './useClientRouter'

assertIsBundledOnce()
useClientRouter()
