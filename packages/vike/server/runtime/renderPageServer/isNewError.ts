export { setAlreadyLogged }
export { hasAlreadyLogged }

import { getGlobalObject, isObject } from '../../utils.js'

const globalObject = getGlobalObject('renderPageServer/isNewError.ts', {
  wasAlreadyLogged: new WeakSet<object>(),
})

function hasAlreadyLogged(err: unknown): boolean {
  if (!isObject(err)) return false
  return globalObject.wasAlreadyLogged.has(err)
}
function setAlreadyLogged(err: unknown): void {
  if (!isObject(err)) return
  globalObject.wasAlreadyLogged.add(err)
}
