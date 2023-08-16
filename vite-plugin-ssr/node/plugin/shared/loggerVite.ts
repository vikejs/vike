export { improveViteLogs }

import { assert, removeEmptyLines, trimWithAnsi, trimWithAnsiTrailOnly } from '../utils.js'
import { logViteErrorContainingCodeSnippet, logViteAny, clearLogs } from './loggerNotProd.js'
import { isErrorWithCodeSnippet } from './loggerNotProd/errorWithCodeSnippet.js'
import { getHttpRequestAsyncStore } from './getHttpRequestAsyncStore.js'
import { removeSuperfluousViteLog } from './loggerVite/removeSuperfluousViteLog.js'
import type { LogType, ResolvedConfig, LogErrorOptions } from 'vite'
import { isErrorDebug } from './isErrorDebug.js'

function improveViteLogs(config: ResolvedConfig) {
  intercept('info', config)
  intercept('warn', config)
  intercept('error', config)
}

function intercept(logType: LogType, config: ResolvedConfig) {
  config.logger[logType] = (msg, options: LogErrorOptions = {}) => {
    assert(!isErrorDebug())

    if (removeSuperfluousViteLog(msg)) return

    if (!!options.timestamp) {
      msg = trimWithAnsi(msg)
    } else {
      // No timestamp => no "[vite]" tag prepended => we don't trim the beginning of the message
      msg = trimWithAnsiTrailOnly(msg)
    }
    msg = cleanFirstViteLog(msg)

    const store = getHttpRequestAsyncStore()

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
      logViteErrorContainingCodeSnippet(options.error)
      return
    }

    // Only allow Vite to clear its first log. All other clearing is controlled by vite-plugin-ssr.
    if (options.clear) clearLogs({ clearIfFirstLog: true })
    if (options.error) store?.markErrorAsLogged(options.error)
    // Vite's default logger preprends the "[vite]" tag if and only if options.timestamp is true
    const prependViteTag = options.timestamp || !!store?.httpRequestId
    logViteAny(msg, logType, store?.httpRequestId ?? null, prependViteTag)
  }
}

function cleanFirstViteLog(msg: string): string {
  const isFirstVitLog = msg.includes('VITE') && msg.includes('ready')
  if (isFirstVitLog) {
    return removeEmptyLines(msg)
  } else {
    return msg
  }
}
