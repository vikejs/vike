// Bun doesn't support Async Hooks: https://github.com/oven-sh/bun/issues/1832
// Do we foresee other JavaScript server runtimes that won't support Async Hooks?

export { installAsyncHook }
export { getAsyncHookStore }

import { renderPage_setWrapper } from '../../runtime/renderPage'
import { assert, isObject } from '../utils'
import type { AsyncLocalStorage as AsyncLocalStorageType } from 'node:async_hooks'

type AsyncHookStore = { httpRequestId: number; loggedErrors: Set<unknown>; swallowedErrorMessages: Set<string> }
let asyncLocalStorage: null | AsyncLocalStorageType<AsyncHookStore> = null

async function installAsyncHook(): Promise<void> {
  let mod: typeof import('node:async_hooks')
  try {
    mod = await import('node:async_hooks')
  } catch {
    return
  }
  asyncLocalStorage = new mod.AsyncLocalStorage()
  renderPage_setWrapper(async (httpRequestId, renderPage) => {
    const loggedErrors = new Set<unknown>()
    const swallowedErrorMessages = new Set<string>()
    const onRequestDone = () => {
      swallowedErrorMessages.forEach((errMsg) => {
        if (!Array.from(loggedErrors).some((err) => String(err).includes(errMsg))) {
          console.error('loggedErrors', loggedErrors)
          console.error('swallowedErrorMessages', swallowedErrorMessages)
          assert(false)
        }
      })
    }
    assert(asyncLocalStorage)
    const pageContextReturn = await asyncLocalStorage.run(
      { httpRequestId, loggedErrors, swallowedErrorMessages },
      renderPage
    )
    return { pageContextReturn, onRequestDone }
  })
  return
}

function getAsyncHookStore(): null | undefined | AsyncHookStore {
  if (asyncLocalStorage === null) return null
  const store = asyncLocalStorage.getStore()
  assert(store === undefined || isObject(store))
  return store
}
