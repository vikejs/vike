export { isErrorDebug }

import { isDebugEnabled } from '../utils.mjs'

function isErrorDebug(): boolean {
  return isDebugEnabled('vps:error')
}
