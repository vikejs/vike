export { customClearScreen }
export { isFirstViteLog }
export { fixVite_removeDevOptimizationLog_enable }
export { fixVite_removeDevOptimizationLog_disable }

import { assert, assertHasLogged } from '../../utils'
import type { LogType, ResolvedConfig, LogErrorOptions } from 'vite'
import { isConfigInvalid } from '../../../runtime/renderPage/isConfigInvalid'
import { onAllRequestDone_set } from '../../../runtime/renderPage/logger'
import { asyncLocalStorage } from '../../../runtime/renderPage'
import { logErrorWithVite } from '../../shared/logWithVite'

let isFirstViteLog = true
const swallowedErrors = new Set<Err>()
const swallowedErrorMessages = new Set<string>()

onAllRequestDone_set((loggedErrors: unknown[]) => {
  swallowedErrors.forEach((err) => {
    if (loggedErrors.includes(err)) {
      swallowedErrors.delete(err)
    }
  })
  swallowedErrorMessages.forEach((errMsg) => {
    if (loggedErrors.some((err) => String(err).includes(errMsg))) {
      swallowedErrorMessages.delete(errMsg)
    }
  })
  if (swallowedErrors.size > 0 || swallowedErrorMessages.size > 0) {
    console.error('swallowedErrors', swallowedErrors)
    console.error('swallowedErrorMessages', swallowedErrorMessages)
    assert(false, 'see swallowedErrors logs above')
  }
  loggedErrors.length = 0
})

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
    const store = asyncLocalStorage.getStore()
    if (store && options?.error) {
      const { loggedErrors2, httpRequestId } = store
      const { error } = options
      if (!loggedErrors2.includes(error)) {
        logErrorWithVite(error, { httpRequestId, canBeViteUserLand: true })
        loggedErrors2.push(error)
      }
      return
    }

    if (logType === 'error' && !options?._isFromVike && msg.startsWith('Transform failed with ')) {
      swallowedErrorMessages.add(msg)
    }
    /*
    if (logType === 'error' && !options?._isFromVike) {
      if (options?.error) {
        const { plugin } = options.error
        if (plugin?.startsWith('vite:') && (plugin.includes('esbuild') || plugin.includes('babel'))) {
          swallowedErrors.add(options.error)
          return
        }
      } else {
        if (msg.includes('Transform failed')) {
          swallowedErrorMessages.add(msg)
          return
        }
      }
    }
    */

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
