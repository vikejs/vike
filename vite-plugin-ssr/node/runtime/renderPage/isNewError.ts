export { isNewError }
export { setAlreadyLogged }

import { getGlobalObject, isObject, isEquivalentError, warnIfObjectIsNotObject } from '../utils.js'

const globalObject = getGlobalObject('runtime/renderPage/isNewError.ts', {
  wasAlreadyLogged: new WeakSet<object>()
})

function isNewError(errErrorPage: unknown, errNominalPage: unknown): boolean {
  warnIfObjectIsNotObject(errErrorPage)
  return !isEquivalentError(errNominalPage, errErrorPage) || !hasAlreadyLogged(errNominalPage)
}
function hasAlreadyLogged(err: unknown): boolean {
  if (!isObject(err)) return false
  return globalObject.wasAlreadyLogged.has(err)
}
function setAlreadyLogged(err: unknown): void {
  if (!isObject(err)) return
  globalObject.wasAlreadyLogged.add(err)
}
