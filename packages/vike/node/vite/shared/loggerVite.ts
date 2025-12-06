export { improveViteLogs }
export { processStartupLog }
export { swallowViteLogForceOptimization_enable }
export { swallowViteLogForceOptimization_disable }
export { swallowViteLogConnected }
export { swallowViteLogConnected_clean }

import {
  assert,
  getGlobalObject,
  isDebugError,
  removeEmptyLines,
  trimWithAnsi,
  trimWithAnsiTrailOnly,
} from '../utils.js'
import { getHttpRequestId_withAsyncHook } from '../../../server/runtime/asyncHook.js'
import { logErrorServerDev, logVite } from './loggerDev.js'
import type { LogType as LoggerType, ResolvedConfig, LogErrorOptions } from 'vite'

const globalObject = getGlobalObject('vite/shared/loggerDev.ts', {
  processStartupLog_isViteStartupLogCompact: null as null | boolean,
  processStartupLog_hasViteStartupLogged: null as null | true,
  processStartupLog_hasViteHelpShortcutLogged: null as null | true,
  swallowViteLogForceOptimization_enabled: false,
  swallowViteLogConnected_originalConsoleLog: null as typeof console.log | null,
})

function improveViteLogs(config: ResolvedConfig) {
  if (isDebugError()) return
  intercept('info', config)
  intercept('warn', config)
  intercept('error', config)
}

function intercept(loggerType: LoggerType, config: ResolvedConfig) {
  let isBeginning = true
  setTimeout(() => (isBeginning = false), 10 * 1000)

  config.logger[loggerType] = (msg, options: LogErrorOptions = {}) => {
    assert(!isDebugError())

    if (swallowViteLogForceOptimization(msg)) return

    if (!!options.timestamp) {
      msg = trimWithAnsi(msg)
    } else {
      // No timestamp => no "[vite]" tag prepended => we don't trim the beginning of the message
      msg = trimWithAnsiTrailOnly(msg)
    }

    if (isBeginning) {
      msg = processStartupLog_onViteLog(msg, config)
    }

    if (options.error) {
      // Vite does a poor job of handling errors.
      //  - It doesn't format error code snippets.
      //  - It only shows error.message which means that crucial information such as error.id isn't shown to the user.
      logErrorServerDev(options.error, null, true)
      // We swallow Vite's message: we didn't see it add any value so far.
      //  - It can even be confusing, such as the following:
      //    ```
      //    Error when evaluating SSR module virtual:vike:page-entry:server:/pages/abort: failed to import "/pages/abort/+Page.mdx"
      //    ```
      assert(!isDebugError())
      return
    }

    const requestId = getHttpRequestId_withAsyncHook()

    // Vite's default logger preprends the "[vite]" tag if and only if options.timestamp is true
    const prependViteTag = options.timestamp || typeof requestId === 'number'
    // If it's an actual error => options.error is set => it's handled with logErrorServerDev() above
    logVite(msg, loggerType, requestId, prependViteTag)
  }
}

// - Clears screen if zero previous log
// - Manages new lines
function processStartupLog(firstLine: string, config: ResolvedConfig) {
  const shouldClear = processStartupLog_shouldClear(config)
  if (shouldClear) {
    config.logger.clearScreen('info')
  } else {
    // Remove leading new line (for both Vite and Vike's startup log)
    firstLine = removeEmptyLines(firstLine)
  }
  return { firstLine, isCompact: !shouldClear }
}
function processStartupLog_shouldClear(config: ResolvedConfig) {
  const hasLoggedBefore = process.stdout.bytesWritten !== 0 || process.stderr.bytesWritten !== 0
  const notDisabled = config.clearScreen !== false
  const shouldClear = notDisabled && !hasLoggedBefore
  return shouldClear
}
function processStartupLog_onViteLog(msg: string, config: ResolvedConfig): string {
  {
    const isFirstVitLog = msg.includes('VITE') && msg.includes('ready')
    if (isFirstVitLog && !globalObject.processStartupLog_hasViteStartupLogged) {
      globalObject.processStartupLog_hasViteStartupLogged = true
      let { firstLine, isCompact } = processStartupLog(msg, config)
      globalObject.processStartupLog_isViteStartupLogCompact = isCompact
      if (!isCompact) firstLine += '\n'
      return firstLine
    }
  }
  {
    const isViteHelpShortcutLog = msg.includes('press') && msg.includes('to show help')
    if (isViteHelpShortcutLog && !globalObject.processStartupLog_hasViteHelpShortcutLogged) {
      globalObject.processStartupLog_hasViteHelpShortcutLogged = true
      if (
        globalObject.processStartupLog_hasViteStartupLogged &&
        globalObject.processStartupLog_isViteStartupLogCompact === false
      ) {
        return msg + '\n'
      }
    }
  }
  return msg
}

function swallowViteLogForceOptimization(msg: string): boolean {
  if (!globalObject.swallowViteLogForceOptimization_enabled) {
    return false
  }
  if (msg.toLowerCase().includes('forced') && msg.toLowerCase().includes('optimization')) {
    assert(msg === 'Forced re-optimization of dependencies', msg) // assertion fails => Vite changed its message => update this function
    return true
  }
  return false
}
function swallowViteLogForceOptimization_enable(): void {
  globalObject.swallowViteLogForceOptimization_enabled = true
}
function swallowViteLogForceOptimization_disable(): void {
  globalObject.swallowViteLogForceOptimization_enabled = false
}

// Suppress "[vite] connected." message. (It doesn't go through Vite's logger thus we must monkey patch the console.log() function.)
function swallowViteLogConnected(): void {
  if (isDebugError()) return
  if (globalObject.swallowViteLogConnected_originalConsoleLog) return
  globalObject.swallowViteLogConnected_originalConsoleLog = console.log
  console.log = swallowViteLogConnected_logPatch
  setTimeout(swallowViteLogConnected_clean, 3000)
}
// Remove console.log() monkey patch
function swallowViteLogConnected_clean(): void {
  // Don't remove console.log() patches from other libraries (e.g. instrumentation)
  if (console.log === swallowViteLogConnected_logPatch) return
  assert(globalObject.swallowViteLogConnected_originalConsoleLog)
  console.log = globalObject.swallowViteLogConnected_originalConsoleLog
  globalObject.swallowViteLogConnected_originalConsoleLog = null
}
function swallowViteLogConnected_logPatch(...args: unknown[]): void {
  const { swallowViteLogConnected_originalConsoleLog: originalConsoleLog } = globalObject
  assert(originalConsoleLog)
  const msg = args.join(' ')
  if (msg === '[vite] connected.') {
    swallowViteLogConnected_clean()
    return // swallow
  }
  originalConsoleLog.apply(console, args)
}
