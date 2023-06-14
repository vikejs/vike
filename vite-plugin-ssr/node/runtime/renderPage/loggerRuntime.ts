// Logger used by the the server runtime. (Which is also used when pre-rendering.)

export let logError: LogError
export let logInfo: null | LogInfo = null
export { setRuntimeLogger }

import { logErrorProd } from './loggerProd'
import type { LogError, LogInfo } from '../../plugin/shared/loggerNotProd'
import { setAssertColorer } from '../utils'
import pc from '@brillout/picocolors'

setAssertColorer((str, color) => pc[color](pc.bold(str)))
logError =
  // @ts-expect-error
  logError ??
  // Default
  logErrorProd

function setRuntimeLogger(logError_: LogError, logInfo_: LogInfo | null) {
  logError = logError_
  logInfo = logInfo_
}
