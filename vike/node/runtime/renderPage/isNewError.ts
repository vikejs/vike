export { isNewError }
export { setAlreadyLogged }

import { getGlobalObject, isObject, isSameError, warnIfErrorIsNotObject } from '../utils.js'

const globalObject = getGlobalObject('runtime/renderPage/isNewError.ts', {
  wasAlreadyLogged: new WeakSet<object>()
})

function isNewError(errErrorPage: unknown, errNominalPage: unknown): boolean {
  warnIfErrorIsNotObject(errErrorPage)
  return !isSameError(errNominalPage, errErrorPage) || !hasAlreadyLogged(errNominalPage)
}
function hasAlreadyLogged(err: unknown): boolean {
  if (!isObject(err)) return false
  return globalObject.wasAlreadyLogged.has(err)
}
function setAlreadyLogged(err: unknown): void {
  if (!isObject(err)) return
  globalObject.wasAlreadyLogged.add(err)
}
