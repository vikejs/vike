// Logger used by the the server runtime. (Also during pre-rendering since it uses the sever runtime.)

export let logRuntimeError: LogRuntimeError
export let logRuntimeInfo: LogRuntimeInfo | null | LogRuntimeInfo = null // is `null` in production
export { setLogRuntimeDev }

import { loggRuntimeErrorProd } from './renderPageServer/loggerProd.js'
import type { LogType } from '../../node/vite/shared/loggerDev.js'

type LogRuntimeInfo = (msg: string, httpRequestId: number | null, logType: LogType) => void
type LogRuntimeError = (err: unknown, httpRequestId: number | null) => void

// Set production logger (which is overwritten by loggerDev.ts in non-production environments such as development and during pre-rendering)
logRuntimeError =
  // @ts-expect-error
  logRuntimeError ??
  // Default
  loggRuntimeErrorProd

function setLogRuntimeDev(logRuntimeErrorDev: LogRuntimeError, logRuntimeInfoDev: LogRuntimeInfo | null) {
  logRuntimeError = logRuntimeErrorDev
  logRuntimeInfo = logRuntimeInfoDev
}
