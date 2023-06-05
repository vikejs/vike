export { customClearScreen }

import { hasLogged } from '../../utils'
import type { LogType, ResolvedConfig } from 'vite'
import { isInvalidConfig } from '../../../runtime/renderPage/isInvalidConfig'

function customClearScreen(config: ResolvedConfig) {
  if (config.clearScreen === false) {
    return
  }
  interceptLogger(
    'info',
    config,
    // Allow initial clear if no assertWarning() was shown
    (msg) => msg.includes('VITE') && msg.includes('ready in') && !hasLogged() && !isInvalidConfig
  )
  interceptLogger('warn', config)
  interceptLogger('error', config)
}

type Logger = (...args: [string, { clear?: boolean } | undefined]) => void

function interceptLogger(logType: LogType, config: ResolvedConfig, tolerateClear?: (msg: string) => boolean) {
  const loggerOld = config.logger[logType].bind(config.logger)
  const loggerNew: Logger = (...args) => {
    const [msg, options] = args
    if (options?.clear && !tolerateClear?.(msg)) {
      options.clear = false
    }
    loggerOld(...args)
  }
  config.logger[logType] = loggerNew
}
