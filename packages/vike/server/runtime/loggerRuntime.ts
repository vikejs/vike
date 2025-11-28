// Logger used by the the server runtime. (Also during pre-rendering since it uses the sever runtime.)

export let logRuntimeError: LogError
export let logRuntimeInfo: null | LogInfo = null // logInfo is null in production
export { overwriteRuntimeProductionLogger }

// TODO rename logErrorProd loggRuntimeErrorProd
// TODO rename_full loggerDev loggerDep
// TODO rename logRuntimeError logRuntimeErrorDev (temp rename it in this file before)
// TODO rename more?
import { logErrorProd } from './renderPageServer/loggerProd.js'
import type { LogError, LogInfo } from '../../node/vite/shared/loggerDev.js'

// Set production logger (which is overwritten by loggerDev.ts in non-production environments such as development and during pre-rendering)
logRuntimeError =
  // @ts-expect-error
  logRuntimeError ??
  // Default
  logErrorProd

function overwriteRuntimeProductionLogger(logError_: LogError, logInfo_: LogInfo | null) {
  logRuntimeError = logError_
  logRuntimeInfo = logInfo_
}
