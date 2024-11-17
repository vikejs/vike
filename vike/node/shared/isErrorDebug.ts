export { isErrorDebug }

import { isDebugActivated } from './utils'

function isErrorDebug(): boolean {
  return isDebugActivated('vike:error')
}
