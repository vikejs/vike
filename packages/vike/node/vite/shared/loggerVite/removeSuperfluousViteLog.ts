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

// Suppress "[vite] connected." message that isn't logged using Vite's logger
function swallowViteConnectedMessage(): void {
  if (globalObject.originalConsoleLog) return
  const originalConsoleLog = (globalObject.originalConsoleLog = console.log)
  console.log = function (...args: unknown[]) {
    const msg = args.join(' ')
    // Swallow
    if (msg === '[vite] connected.') return
    originalConsoleLog.apply(console, args)
  }
  setTimeout(swallowViteConnectedMessage_clean, 3000)
}
// Remove console.log() patch
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
