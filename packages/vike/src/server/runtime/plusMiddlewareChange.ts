export { onPlusMiddlewareChange }
export { setPlusMiddlewareFetched }
export { notifyPlusMiddlewareChange }

// In development, a server that applies `await getUniversalMiddlewares()` itself holds the list it got: it has to be re-run when the
// +middleware change. (`vike(app)` looks them up upon each request.)

import { getGlobalObject } from '../../utils/getGlobalObject.js'
import '../assertEnvServer.js'

const globalObject = getGlobalObject('runtime/plusMiddlewareChange.ts', {
  // The +middleware of the list getUniversalMiddlewares() last returned. `null` if the config was erroneous, `undefined` if it wasn't called since the last change.
  fetched: undefined as unknown[] | null | undefined,
  listeners: new Set<() => void>(),
})

function setPlusMiddlewareFetched(plusMiddlewares: unknown[] | null) {
  globalObject.fetched = plusMiddlewares
}

// Returns the function that removes the listener
function onPlusMiddlewareChange(listener: () => void): () => void {
  globalObject.listeners.add(listener)
  return () => globalObject.listeners.delete(listener)
}

// Called with the +middleware of the config that was just (re)loaded
function notifyPlusMiddlewareChange(plusMiddlewares: unknown[]) {
  const { fetched } = globalObject
  if (fetched === undefined) return
  if (
    fetched !== null &&
    fetched.length === plusMiddlewares.length &&
    fetched.every((m, i) => m === plusMiddlewares[i])
  )
    return
  // The server gets the new list when it's re-run, which sets it again
  globalObject.fetched = undefined
  globalObject.listeners.forEach((listener) => listener())
}
