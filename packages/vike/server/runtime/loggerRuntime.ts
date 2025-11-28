// Logger used by the the server runtime. (Also during pre-rendering since it uses the sever runtime.)

export let logRuntimeError: LogRuntimeError
export let logRuntimeInfo: LogRuntimeInfo | null | LogRuntimeInfo = null // is `null` in production
export { setLogRuntimeDev }
export { assertPageContext_logRuntime }
export type { PageContext_logRuntime }

import { loggRuntimeErrorProd } from './renderPageServer/loggerProd.js'
import type { LogType } from '../../node/vite/shared/loggerDev.js'
import { assert } from '../utils.js'

type LogRuntimeInfo = (msg: string, pageContext: PageContext_logRuntime, logType: LogType) => void
type LogRuntimeError = (err: unknown, pageContext: PageContext_logRuntime) => void
type PageContext_logRuntime =
  | 'NULL_TEMP'
  | {
      // httpRequestId is `null` when pre-rendering
      _httpRequestId: number | null
    }

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

function assertPageContext_logRuntime(pageContext: PageContext_logRuntime) {
  assert(
    pageContext === 'NULL_TEMP' ||
      typeof pageContext._httpRequestId === 'number' ||
      pageContext._httpRequestId === null,
  )
}
