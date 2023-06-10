export let logError = logErrorProd
export let logInfo: null | LoggerInfo = null
export { isNewError }

export type { LogErrorArgs }
export { logError_set }
export { logInfo_set }

import type { LogInfoArgs } from '../../plugin/shared/loggerTranspile'
import { isRenderErrorPageException } from '../../../shared/route/RenderErrorPage'
import { assert, getGlobalObject, isObject, isSameErrorMessage, warnIfObjectIsNotObject } from '../utils'
import pc from '@brillout/picocolors'

const globalObject = getGlobalObject('runtime/renderPage/logger.ts', {
  wasAlreadyLogged: new WeakSet<object>()
})

type LoggerError = (...args: LogErrorArgs) => boolean
type LoggerInfo = (...args: LogInfoArgs) => void
type LogErrorArgs = [
  unknown,
  {
    // httpRequestId is null upon pre-rendering
    httpRequestId: number | null
    canBeViteUserLand: boolean
  }
]

function logError_set(logger: LoggerError) {
  logError = logger
}
function logInfo_set(logger: LoggerInfo) {
  logInfo = logger
}

function logErrorProd(...[err, { canBeViteUserLand }]: LogErrorArgs): boolean {
  warnIfObjectIsNotObject(err)
  setAlreadyLogged(err)

  if (isRenderErrorPageException(err)) {
    assert(canBeViteUserLand)
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
