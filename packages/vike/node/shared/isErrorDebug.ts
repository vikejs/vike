export { isErrorDebug }

import { isDebugActivated } from './utils.js'

function isErrorDebug(): boolean {
  return isDebugActivated('vike:error')
}
