export { customizeViteLogger }
export { isFirstViteLog }

import { assert, assertHasLogged, trimWithAnsi, trimWithAnsiTrail } from '../utils'
import { isConfigInvalid } from '../../runtime/renderPage/isConfigInvalid'
import { logViteFrameError, logViteAny } from './loggerNotProd'
import { isFrameError } from './loggerNotProd/formatFrameError'
import { getAsyncHookStore } from './asyncHook'
import { removeSuperfluousViteLog } from './loggerVite/removeSuperfluousViteLog'
import type { LogType, ResolvedConfig, LogErrorOptions } from 'vite'

let isFirstViteLog = true

function customizeViteLogger(config: ResolvedConfig) {
  interceptLogger(
    'info',
    config,
    // Allow initial clear only if no assertWarning() was shown and if config is valid
    () => isFirstViteLog && !assertHasLogged() && !isConfigInvalid
  )
  interceptLogger('warn', config)
  interceptLogger('error', config)
}

function interceptLogger(logType: LogType, config: ResolvedConfig, tolerateClear?: () => boolean) {
  config.logger[logType] = (msg, options: LogErrorOptions = {}) => {
    const store = getAsyncHookStore()

    if (!!options.timestamp) {
      // timestamp => tag "[vite]" is prepended
      msg = trimWithAnsi(msg)
    } else {
      msg = trimWithAnsiTrail(msg)
    }

    if (removeSuperfluousViteLog(msg)) return

    // Dedupe Vite error messages
    if (options.error && store?.hasErrorLogged(options.error)) {
      return
    }
    if (msg.startsWith('Transform failed with ') && store && logType === 'error') {
      store.addSwallowedErrorMessage(msg)
      return
    }

    if (options.error) {
      const { error } = options
      if (isFrameError(error)) {
        logViteFrameError(error)
        assert(!store || store.hasErrorLogged(error))
        return
      }
    }

    // Customize clear behavior
    if (options.clear && !tolerateClear?.()) options.clear = false
    isFirstViteLog = false

    if (options.error) store?.addLoggedError(options.error)
    logViteAny(
      msg,
      logType,
      store?.httpRequestId ?? null,
      // Vite's default logger prints the "[vite]" tag when options.timestamp is true
      options.timestamp || !!store?.httpRequestId,
      options.clear ?? false,
      config
    )
  }
}
