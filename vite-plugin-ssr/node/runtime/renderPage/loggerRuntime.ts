export let logError: LogError = logErrorProd
export let logInfo: null | LogInfo = null
export { setRuntimeLogger }

import { logErrorProd } from './loggerProd'
import type { LogError } from './loggerProd'
import type { LogInfo } from '../../plugin/shared/loggerNotProd'

function setRuntimeLogger(logError_: LogError, logInfo_: LogInfo) {
  logError = logError_
  logInfo = logInfo_
}
