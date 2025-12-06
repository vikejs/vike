export { improveViteLogs }
export { processStartupLogFirstLine }

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
import { removeSuperfluousViteLog, swallowViteConnectedMessage } from './loggerVite/removeSuperfluousViteLog.js'
import type { LogType as LoggerType, ResolvedConfig, LogErrorOptions } from 'vite'

const globalObject = getGlobalObject('vite/shared/loggerDev.ts', {
  isViteStartupLogCompact: null as null | boolean,
  isViteStartupLog: null as null | boolean,
})

function improveViteLogs(config: ResolvedConfig) {
  intercept('info', config)
  intercept('warn', config)
  intercept('error', config)
  swallowViteConnectedMessage()
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
    msg = cleanFirstViteLog(msg, config)

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

function cleanFirstViteLog(msg: string, config: ResolvedConfig): string {
  {
    const isFirstVitLog = msg.includes('VITE') && msg.includes('ready')
    if (isFirstVitLog) {
      globalObject.isViteStartupLog = true
      const ret = processStartupLogFirstLine(msg, config)
      globalObject.isViteStartupLogCompact = ret.isCompact
      msg = ret.firstLine
      if (!ret.isCompact) msg += '\n'
      return msg
    }
  }
  {
    const isViteHelpShortcutLog = msg.includes('press') && msg.includes('to show help')
    if (isViteHelpShortcutLog && globalObject.isViteStartupLog && globalObject.isViteStartupLogCompact === false) {
      msg += '\n'
    }
  }

  return msg
}

function processStartupLogFirstLine(firstLine: string, config: ResolvedConfig) {
  const shouldClear = shouldStartupLogClear(config)
  if (shouldClear) {
    config.logger.clearScreen('info')
  } else {
    // Compact
    firstLine = removeEmptyLines(firstLine)
  }
  return { firstLine, isCompact: !shouldClear }
}
function shouldStartupLogClear(config: ResolvedConfig) {
  const hasExistingLogs = process.stdout.bytesWritten !== 0 || process.stderr.bytesWritten !== 0
  const notDisabled = config.clearScreen !== false
  const shouldClear = notDisabled && !hasExistingLogs
  return shouldClear
}
