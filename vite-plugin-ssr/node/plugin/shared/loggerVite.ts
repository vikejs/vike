export { customizeViteLogger }

import { trimWithAnsi, trimWithAnsiTrail } from '../utils'
import { isConfigInvalid } from '../../runtime/renderPage/isConfigInvalid'
import { logViteFrameError, logViteAny, clearWithCondition } from './loggerNotProd'
import { isFrameError } from './loggerNotProd/formatFrameError'
import { getHttpRequestAsyncStore } from './getHttpRequestAsyncStore'
import { removeSuperfluousViteLog } from './loggerVite/removeSuperfluousViteLog'
import type { LogType, ResolvedConfig, LogErrorOptions } from 'vite'

function customizeViteLogger(config: ResolvedConfig) {
  interceptLogger('info', config)
  interceptLogger('warn', config)
  interceptLogger('error', config)
}

function interceptLogger(logType: LogType, config: ResolvedConfig) {
  config.logger[logType] = (msg, options: LogErrorOptions = {}) => {
    const store = getHttpRequestAsyncStore()

    if (!!options.timestamp) {
      // timestamp => tag "[vite]" is prepended
      msg = trimWithAnsi(msg)
    } else {
      msg = trimWithAnsiTrail(msg)
    }

    if (removeSuperfluousViteLog(msg)) return

    // Dedupe Vite error messages
    if (options.error && store?.shouldErrorBeSwallowed(options.error)) {
      return
    }
    if (msg.startsWith('Transform failed with ') && store && logType === 'error') {
      store.markErrorMessageAsLogged(msg)
      return
    }

    if (options.error) {
      const { error } = options
      if (isFrameError(error)) {
        logViteFrameError(error)
        return
      }
    }

    if (options.clear && !isConfigInvalid) {
      clearWithCondition({ clearIfFirstLog: true })
    }

    if (options.error) store?.markErrorAsLogged(options.error)
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
