export { removeSuperfluousViteLog }
export { removeSuperfluousViteLog_enable }
export { removeSuperfluousViteLog_disable }
export { swallowViteConnectedMessage }
export { swallowViteConnectedMessage_clean }

import { assert, getGlobalObject, isDebugError } from '../../utils.js'
const globalObject = getGlobalObject('removeSuperfluousViteLog.ts', {
  removeSuperfluousViteLog_enabled: false,
  swallowViteConnectedMessage_originalConsoleLog: null as typeof console.log | null,
})
function removeSuperfluousViteLog(msg: string): boolean {
  if (!globalObject.removeSuperfluousViteLog_enabled) {
    return false
  }
  if (msg.toLowerCase().includes('forced') && msg.toLowerCase().includes('optimization')) {
    assert(msg === 'Forced re-optimization of dependencies', msg) // assertion fails => Vite changed its message => update this function
    return true
  }
  return false
}
function removeSuperfluousViteLog_enable(): void {
  globalObject.removeSuperfluousViteLog_enabled = true
}
function removeSuperfluousViteLog_disable(): void {
  globalObject.removeSuperfluousViteLog_enabled = false
}

// Suppress "[vite] connected." message. (It doesn't go through Vite's logger thus we must monkey patch the console.log() function.)
function swallowViteConnectedMessage(): void {
  if (isDebugError()) return
  if (globalObject.swallowViteConnectedMessage_originalConsoleLog) return
  globalObject.swallowViteConnectedMessage_originalConsoleLog = console.log
  console.log = swallowViteConnectedMessage_logPatch
  setTimeout(swallowViteConnectedMessage_clean, 3000)
}
// Remove console.log() monkey patch
function swallowViteConnectedMessage_clean(): void {
  // Don't remove console.log() patches from other libraries (e.g. instrumentation)
  if (console.log === swallowViteConnectedMessage_logPatch) return
  assert(globalObject.swallowViteConnectedMessage_originalConsoleLog)
  console.log = globalObject.swallowViteConnectedMessage_originalConsoleLog
  globalObject.swallowViteConnectedMessage_originalConsoleLog = null
}
function swallowViteConnectedMessage_logPatch(...args: unknown[]): void {
  const { swallowViteConnectedMessage_originalConsoleLog: originalConsoleLog } = globalObject
  assert(originalConsoleLog)
  const msg = args.join(' ')
  if (msg === '[vite] connected.') {
    swallowViteConnectedMessage_clean()
    return // swallow
  }
  originalConsoleLog.apply(console, args)
}
