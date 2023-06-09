export { isErrorDebug }

import { isDebugEnabled } from '../utils'

function isErrorDebug(): boolean {
  return isDebugEnabled('vps:error')
}
