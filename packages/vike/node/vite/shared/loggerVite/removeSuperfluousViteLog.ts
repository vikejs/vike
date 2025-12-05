export { removeSuperfluousViteLog }
export { removeSuperfluousViteLog_enable }
export { removeSuperfluousViteLog_disable }
export { swallowViteConnectedMessage }
export { swallowViteConnectedMessage_clean }

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

// Suppress "[vite] connected." message that isn't logged using Vite's logger
function swallowViteConnectedMessage(): void {
  if (globalObject.originalConsoleLog) return // Already suppressed
  globalObject.originalConsoleLog = console.log
  console.log = function (...args: any[]) {
    const msg = args.join(' ')
    if (msg === '[vite] connected.') {
      return
    }
    globalObject.originalConsoleLog!.apply(console, args)
  }
}
function swallowViteConnectedMessage_clean(): void {
  if (globalObject.originalConsoleLog) {
    console.log = globalObject.originalConsoleLog
    globalObject.originalConsoleLog = null
  }
}

function removeSuperfluousViteLog_enable(): void {
  globalObject.enabled = true
}
function removeSuperfluousViteLog_disable(): void {
  globalObject.enabled = false
}
