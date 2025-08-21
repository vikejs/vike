export { removeSuperfluousViteLog }
export { removeSuperfluousViteLog_enable }
export { removeSuperfluousViteLog_disable }

import { assert, getGlobalObject } from '../../utils.js'
const globalObject = getGlobalObject('removeSuperfluousViteLog.ts', {
  enabled: false,
})
const superfluousLog = 'Forced re-optimization of dependencies'

function removeSuperfluousViteLog(msg: string): boolean {
  if (!globalObject.enabled) {
    return false
  }
  if (msg.toLowerCase().includes('forced') && msg.toLowerCase().includes('optimization')) {
    assert(msg === superfluousLog, msg) // assertion fails => Vite changed its message => update this function
    return true
  }
  return false
}
function removeSuperfluousViteLog_enable(): void {
  globalObject.enabled = true
}
function removeSuperfluousViteLog_disable(): void {
  globalObject.enabled = false
}
