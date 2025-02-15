export { isNewError }
export { setAlreadyLogged }

import { getGlobalObject, isObject, isSameErrorMessage, warnIfErrorIsNotObject } from '../utils.js'

const globalObject = getGlobalObject('renderPage/isNewError.ts', {
  wasAlreadyLogged: new WeakSet<object>()
})

function isNewError(errErrorPage: unknown, errNominalPage: unknown): boolean {
  warnIfErrorIsNotObject(errErrorPage)
  return (
    !isSameErrorMessage(errNominalPage, errErrorPage) ||
    // Isn't this redudant/superfluous? I think we can remove this entire file and only use isSameErrorMessage() instead.
    !hasAlreadyLogged(errNominalPage)
  )
}
function hasAlreadyLogged(err: unknown): boolean {
  if (!isObject(err)) return false
  return globalObject.wasAlreadyLogged.has(err)
}
function setAlreadyLogged(err: unknown): void {
  if (!isObject(err)) return
  globalObject.wasAlreadyLogged.add(err)
}
