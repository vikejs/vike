export { isNewError }
export { setAlreadyLogged }

import { getGlobalObject, isObject, isSameErrorMessage, warnIfObjectIsNotObject } from '../utils'

const globalObject = getGlobalObject('runtime/renderPage/logger.ts', {
  wasAlreadyLogged: new WeakSet<object>()
})

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
