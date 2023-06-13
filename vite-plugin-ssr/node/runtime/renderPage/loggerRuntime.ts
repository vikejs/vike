export let logError: LogError = logErrorProd
export { logError_set }
export let logInfo: null | LogInfo = null
export { logInfo_set }
export { isNewError }
export type { LogErrorArgs }

import type { LogInfoArgs } from '../../plugin/shared/loggerNotProd'
import { isRenderErrorPageException } from '../../../shared/route/RenderErrorPage'
import { getGlobalObject, isObject, isSameErrorMessage, warnIfObjectIsNotObject } from '../utils'
import pc from '@brillout/picocolors'

const globalObject = getGlobalObject('runtime/renderPage/logger.ts', {
  wasAlreadyLogged: new WeakSet<object>()
})

type LogError = (...args: LogErrorArgs) => boolean
type LogInfo = (...args: LogInfoArgs) => void
type LogErrorArgs = [
  unknown,
  {
    // httpRequestId is null upon pre-rendering
    httpRequestId: number | null
  }
]

function logError_set(logError_: LogError) {
  logError = logError_
}
function logInfo_set(logInfo_: LogInfo) {
  logInfo = logInfo_
}

function logErrorProd(err: unknown): boolean {
  warnIfObjectIsNotObject(err)
  setAlreadyLogged(err)

  if (isRenderErrorPageException(err)) {
    return false
  }

  // We ensure we print a string; Cloudflare Workers doesn't seem to properly stringify `Error` objects.
  const errStr = isObject(err) && 'stack' in err ? String(err.stack) : String(err)
  console.error(pc.red(errStr))
  return true
}

function isNewError(errErrorPage: unknown, errFirstAttempt: unknown): boolean {
  warnIfObjectIsNotObject(errErrorPage)
  return !isSameErrorMessage(errFirstAttempt, errErrorPage) || !hasAlreadyLogged(errFirstAttempt)
}

function hasAlreadyLogged(err: unknown): boolean {
  if (!isObject(err)) return false
  return globalObject.wasAlreadyLogged.has(err)
}
function setAlreadyLogged(err: unknown): void {
  if (!isObject(err)) return
  globalObject.wasAlreadyLogged.add(err)
}
