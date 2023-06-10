export { customClearScreen }
export { isFirstViteLog }
export { fixVite_removeDevOptimizationLog_enable }
export { fixVite_removeDevOptimizationLog_disable }

import { assert, assertHasLogged } from '../../utils'
import type { LogType, ResolvedConfig, LogErrorOptions } from 'vite'
import { isConfigInvalid } from '../../../runtime/renderPage/isConfigInvalid'
import { logErrorWithVite } from '../../shared/logWithVite'
import { getAsyncHookStore } from '../../shared/asyncHook'

let isFirstViteLog = true

function customClearScreen(config: ResolvedConfig) {
  interceptLogger(
    'info',
    config,
    // Allow initial clear only if no assertWarning() was shown and if config is valid
    () => isFirstViteLog && !assertHasLogged() && !isConfigInvalid
  )
  interceptLogger('warn', config)
  interceptLogger('error', config)
}

type Err = LogErrorOptions['error'] & { plugin?: string }
type Logger = (...args: [string, { clear?: boolean; error?: Err; _isFromVike?: true } | undefined]) => void

function interceptLogger(logType: LogType, config: ResolvedConfig, tolerateClear?: () => boolean) {
  const loggerOld = config.logger[logType].bind(config.logger)
  const loggerNew: Logger = (...args) => {
    const [msg, options] = args

    // Dedupe Vite error messages
    {
      const store = getAsyncHookStore()
      assert(store !== null)
      if (store !== undefined) {
        if (options?.error) {
          const { loggedErrors, httpRequestId } = store
          const { error } = options
          if (!loggedErrors.includes(error)) {
            logErrorWithVite(error, { httpRequestId, canBeViteUserLand: true })
            assert(loggedErrors.includes(error))
          }
          return
        }
        if (logType === 'error' && !options?._isFromVike && msg.startsWith('Transform failed with ')) {
          store.swallowedErrorMessages.push(msg)
          return
        }
      }
    }

    if (removeDevOptimizationLog && fixVite_removeDevOptimizationLog_isMatch(msg)) return

    if (options?.clear && !tolerateClear?.()) options.clear = false
    isFirstViteLog = false

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
