export { removeSuperfluousViteLog }
export { removeSuperfluousViteLog_enable }
export { removeSuperfluousViteLog_disable }

import { assert } from '../../utils.js'

const superfluousLog = 'Forced re-optimization of dependencies'
let enabled = false

function removeSuperfluousViteLog(msg: string): boolean {
  if (!enabled) {
    return false
  }
  if (msg.toLowerCase().includes('forced') && msg.toLowerCase().includes('optimization')) {
    assert(msg === superfluousLog, msg) // assertion fails => Vite changed its message => update this function
    return true
  }
  return false
}
function removeSuperfluousViteLog_enable(): void {
  enabled = true
}
function removeSuperfluousViteLog_disable(): void {
  enabled = false
}
