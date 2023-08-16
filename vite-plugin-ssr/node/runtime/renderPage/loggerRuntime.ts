// Logger used by the the server runtime. (Also during pre-rendering since it uses the sever runtime.)

export let logRuntimeError: LogError
export let logRuntimeInfo: null | LogInfo = null // logInfo is null in production
export { overwriteRuntimeProductionLogger }

import { logErrorProd } from './loggerProd.js'
import type { LogError, LogInfo } from '../../plugin/shared/loggerNotProd.js'

// Set production logger (which is overwritten by loggerNotProd.ts in non-production environments such as development and during pre-rendering)
logRuntimeError =
  // @ts-expect-error
  logRuntimeError ??
  // Default
  logErrorProd

function overwriteRuntimeProductionLogger(logError_: LogError, logInfo_: LogInfo | null) {
  logRuntimeError = logError_
  logRuntimeInfo = logInfo_
}
