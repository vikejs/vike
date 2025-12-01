export { improveViteLogs }

import { assert, isDebugError, removeEmptyLines, trimWithAnsi, trimWithAnsiTrailOnly } from '../utils.js'
import { logErrorServerDev, logVite } from './loggerDev.js'
import { getHttpRequestAsyncStore } from './getHttpRequestAsyncStore.js'
import { removeSuperfluousViteLog } from './loggerVite/removeSuperfluousViteLog.js'
import type { LogType as LoggerType, ResolvedConfig, LogErrorOptions } from 'vite'

function improveViteLogs(config: ResolvedConfig) {
  intercept('info', config)
  intercept('warn', config)
  intercept('error', config)
}

function intercept(loggerType: LoggerType, config: ResolvedConfig) {
  config.logger[loggerType] = (msg, options: LogErrorOptions = {}) => {
    assert(!isDebugError())

    if (removeSuperfluousViteLog(msg)) return

    if (!!options.timestamp) {
      msg = trimWithAnsi(msg)
    } else {
      // No timestamp => no "[vite]" tag prepended => we don't trim the beginning of the message
      msg = trimWithAnsiTrailOnly(msg)
    }
    msg = cleanFirstViteLog(msg)

    const store = getHttpRequestAsyncStore()

    if (options.error) {
      // Vite does a poor job of handling errors.
      //  - It doesn't format error code snippets.
      //  - It only shows error.message which means that crucial information such as error.id isn't shown to the user.
      logErrorServerDev(options.error, 'NULL_TEMP', true)
      // We swallow Vite's message: we didn't see it add any value so far.
      //  - It can even be confusing, such as the following:
      //    ```
      //    Error when evaluating SSR module virtual:vike:page-entry:server:/pages/abort: failed to import "/pages/abort/+Page.mdx"
      //    ```
      assert(!isDebugError())
      return
    }

    // Vite's default logger preprends the "[vite]" tag if and only if options.timestamp is true
    const prependViteTag = options.timestamp || !!store?.httpRequestId
    // If it's an actual error => options.error is set => it's handled with logErrorServerDev() above
    const logType = loggerType === 'error' ? 'error-note' : loggerType
    logVite(msg, logType, store?.httpRequestId ?? null, prependViteTag)
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
