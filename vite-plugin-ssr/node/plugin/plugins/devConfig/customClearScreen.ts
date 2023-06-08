export { customClearScreen }
export { fixVite_removeDevOptimizationLog_enable }
export { fixVite_removeDevOptimizationLog_disable }

import { assert, assertHasLogged } from '../../utils'
import type { LogType, ResolvedConfig } from 'vite'
import { isConfigInvalid } from '../../../runtime/renderPage/isConfigInvalid'

let isInitialClear = true
function customClearScreen(config: ResolvedConfig) {
  interceptLogger(
    'info',
    config,
    // Allow initial clear only if no assertWarning() was shown and if config is valid
    (msg) => {
      if (!msg.includes('VITE')) return false
      if (!isInitialClear) return false
      isInitialClear = false
      return !assertHasLogged() && !isConfigInvalid
    }
  )
  interceptLogger('warn', config)
  interceptLogger('error', config)
}

type Logger = (...args: [string, { clear?: boolean } | undefined]) => void

function interceptLogger(logType: LogType, config: ResolvedConfig, tolerateClear?: (msg: string) => boolean) {
  const loggerOld = config.logger[logType].bind(config.logger)
  const loggerNew: Logger = (...args) => {
    const [msg, options] = args
    if (removeDevOptimizationLog && fixVite_removeDevOptimizationLog_isMatch(msg)) return
    if (options?.clear && !tolerateClear?.(msg)) options.clear = false
    loggerOld(...args)
  }
  config.logger[logType] = loggerNew
}

let removeDevOptimizationLog = false
function fixVite_removeDevOptimizationLog_enable() {
  removeDevOptimizationLog = true
}
function fixVite_removeDevOptimizationLog_disable() {
  removeDevOptimizationLog = false
}
function fixVite_removeDevOptimizationLog_isMatch(msg: string) {
  const msgL = msg.toLowerCase()
  if (msgL.includes('forced') && msgL.includes('optimization')) {
    assert(msg === 'Forced re-optimization of dependencies', msg) // assertion fails => Vite changed its message => update this function
    return true
  }
  return false
}
