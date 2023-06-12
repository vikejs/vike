export { customizeViteLogger }
export { isFirstViteLog }

import { assert, assertHasLogged } from '../utils'
import { isConfigInvalid } from '../../runtime/renderPage/isConfigInvalid'
import { isErrorWithCodeSnippet, logErrorTranspile, logVite } from './loggerTranspile'
import { getAsyncHookStore } from './asyncHook'
import { removeSuperfluousViteLog } from './loggerVite/removeSuperfluousViteLog'
import { trimWithAnsi, trimWithAnsiTrail } from './trimWithAnsi'
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

    // timestamp => tag "[vite]" is prepended
    const withTag = !!options.timestamp

    if (withTag) {
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
      if (isErrorWithCodeSnippet(error)) {
        logErrorTranspile(error, {
          httpRequestId: store?.httpRequestId ?? null
        })
        assert(!store || store.hasErrorLogged(error))
        return
      }
    }

    // Customize clear behavior
    if (options.clear && !tolerateClear?.()) options.clear = false
    isFirstViteLog = false

    if (options.error) store?.addLoggedError(options.error)
    logVite(msg, logType, store?.httpRequestId ?? null, withTag, options.clear ?? false, config)
  }
}
