export { improveViteLogs }

import { trimWithAnsi, trimWithAnsiTrailOnly } from '../utils'
import { isConfigInvalid } from '../../runtime/renderPage/isConfigInvalid'
import { logViteErrorWithCodeSnippet, logViteAny, clearTheScreen } from './loggerNotProd'
import { isErrorWithCodeSnippet } from './loggerNotProd/errorWithCodeSnippet'
import { getHttpRequestAsyncStore } from './getHttpRequestAsyncStore'
import { removeSuperfluousViteLog } from './loggerVite/removeSuperfluousViteLog'
import type { LogType, ResolvedConfig, LogErrorOptions } from 'vite'

function improveViteLogs(config: ResolvedConfig) {
  intercept('info', config)
  intercept('warn', config)
  intercept('error', config)
}

function intercept(logType: LogType, config: ResolvedConfig) {
  config.logger[logType] = (msg, options: LogErrorOptions = {}) => {
    const store = getHttpRequestAsyncStore()

    if (!!options.timestamp) {
      msg = trimWithAnsi(msg)
    } else {
      // !!timestamp => no tag "[vite]" is prepended => we don't trim the beginning of the message
      msg = trimWithAnsiTrailOnly(msg)
    }

    if (removeSuperfluousViteLog(msg)) return

    // Dedupe Vite error messages
    if (options.error && store?.shouldErrorBeSwallowed(options.error)) {
      return
    }
    // Remove this once https://github.com/vitejs/vite/pull/13495 is released
    if (msg.startsWith('Transform failed with ') && store && logType === 'error') {
      store.markErrorMessageAsLogged(msg)
      return
    }

    if (options.error && isErrorWithCodeSnippet(options.error)) {
      logViteErrorWithCodeSnippet(options.error)
      return
    }

    if (options.clear && !isConfigInvalid) {
      clearTheScreen({ clearIfFirstLog: true })
    }

    if (options.error) store?.markErrorAsLogged(options.error)
    logViteAny(
      msg,
      logType,
      store?.httpRequestId ?? null,
      // Vite's default logger prints the "[vite]" tag when options.timestamp is true
      options.timestamp || !!store?.httpRequestId,
      options.clear ?? false
    )
  }
}
