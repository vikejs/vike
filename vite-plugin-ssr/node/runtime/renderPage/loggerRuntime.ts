// Logger used by the the server runtime. (Also during pre-rendering since it uses the sever runtime.)

export let logError: LogError
export let logInfo: null | LogInfo = null // logInfo is null in production
export { overwriteRuntimeProductionLogger }

import { logErrorProd } from './loggerProd'
import { addAssertColorer } from '../utils'
import pc from '@brillout/picocolors'
import type { LogError, LogInfo } from '../../plugin/shared/loggerNotProd'

// Set production logger (which is overwritten by loggerNotProd.ts in non-production environments such as development and during pre-rendering)
logError =
  // @ts-expect-error
  logError ??
  // Default
  logErrorProd

// Colorize assertion errors/messages
addAssertColorer((str, color) => pc[color](pc.bold(str)))

function overwriteRuntimeProductionLogger(logError_: LogError, logInfo_: LogInfo | null) {
  logError = logError_
  logInfo = logInfo_
}
