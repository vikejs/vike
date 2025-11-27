export { isErrorDebug }

import { isDebugActivated } from '../server/utils.js'

function isErrorDebug(): boolean {
  return isDebugActivated('vike:error')
}
