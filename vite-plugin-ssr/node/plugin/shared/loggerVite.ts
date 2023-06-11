export { customizeViteLogger }
export { isFirstViteLog }

import { assert, assertHasLogged } from '../utils'
import type { LogType, ResolvedConfig, LogErrorOptions } from 'vite'
import { isConfigInvalid } from '../../runtime/renderPage/isConfigInvalid'
import { isErrorWithCodeSnippet, logErrorTranspile } from './loggerTranspile'
import { getAsyncHookStore } from './asyncHook'
import { removeSuperfluousViteLog } from './loggerVite/removeSuperfluousViteLog'
import { trimWithAnsi } from './trimWithAnsi'

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

type Err = LogErrorOptions['error'] & { plugin?: string }
type Logger = (...args: [string, { clear?: boolean; error?: Err } | undefined]) => void

function interceptLogger(logType: LogType, config: ResolvedConfig, tolerateClear?: () => boolean) {
  const loggerOld = config.logger[logType].bind(config.logger)
  const loggerNew: Logger = (msg, options, ...rest) => {
    msg = trimWithAnsi(msg)

    if (removeSuperfluousViteLog(msg)) return

    // Dedupe Vite error messages
    const store = getAsyncHookStore()
    if (options?.error && store?.loggedErrors.has(options.error)) {
      return
    }
    if (msg.startsWith('Transform failed with ') && store && logType === 'error') {
      store.swallowedErrorMessages.add(msg)
      return
    }

    if (options?.error) {
      const { error } = options
      if (isErrorWithCodeSnippet(error)) {
        logErrorTranspile(error, {
          httpRequestId: store?.httpRequestId ?? null
        })
        assert(!store || store.loggedErrors.has(error))
        return
      }
    }

    // Customize clear behavior
    if (options?.clear && !tolerateClear?.()) options.clear = false
    isFirstViteLog = false

    if (options?.error) store?.loggedErrors.add(options.error)
    loggerOld(msg, options, ...rest)
  }
  config.logger[logType] = loggerNew
}
