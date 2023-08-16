export { isErrorDebug }

import { isDebugEnabled } from '../utils.js'

function isErrorDebug(): boolean {
  return isDebugEnabled('vps:error')
}
