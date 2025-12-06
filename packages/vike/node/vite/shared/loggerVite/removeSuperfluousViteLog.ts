export { removeSuperfluousViteLog }
export { removeSuperfluousViteLog_enable }
export { removeSuperfluousViteLog_disable }
export { swallowViteConnectedMessage }
export { swallowViteConnectedMessage_clean }

// TODO: refactor inline this file

import { assert, getGlobalObject } from '../../utils.js'
const globalObject = getGlobalObject('removeSuperfluousViteLog.ts', {
  enabled: false,
  originalConsoleLog: null as typeof console.log | null,
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

// Suppress "[vite] connected." message that isn't logged using Vite's logger
function swallowViteConnectedMessage(): void {
  if (globalObject.originalConsoleLog) return
  console.log = swallowViteConnectedMessage_logPatch
  setTimeout(swallowViteConnectedMessage_clean, 3000)
}
// Remove console.log() monkey patch
function swallowViteConnectedMessage_clean(): void {
  if (
    // Don't remove console.log() patches from other libraries (e.g. instrumentation)
    console.log === swallowViteConnectedMessage_logPatch
  ) {
    assert(globalObject.originalConsoleLog)
    console.log = globalObject.originalConsoleLog
    globalObject.originalConsoleLog = null
  }
}
function swallowViteConnectedMessage_logPatch(...args: unknown[]): void {
  const { originalConsoleLog } = globalObject
  assert(originalConsoleLog)
  const msg = args.join(' ')
  if (msg === '[vite] connected.') {
    swallowViteConnectedMessage_clean()
    return // swallow
  }
  originalConsoleLog.apply(console, args)
}
