export { installAsyncHook }
export { getAsyncHookStore }

import { renderPage_setWrapper } from '../../runtime/renderPage'
import type { AsyncLocalStorage as AsyncLocalStorageType } from 'node:async_hooks'
import { assert, isObject } from '../utils'

type AsyncHookStore = { httpRequestId: number; loggedErrors: unknown[]; swallowedErrorMessages: string[] }
let asyncLocalStorage: null | AsyncLocalStorageType<AsyncHookStore> = null

async function installAsyncHook(): Promise<boolean> {
  let mod: typeof import('node:async_hooks')
  try {
    mod = await import('node:async_hooks')
  } catch {
    return false
  }
  asyncLocalStorage = new mod.AsyncLocalStorage()
  renderPage_setWrapper(async (httpRequestId, renderPage) => {
    const loggedErrors: unknown[] = []
    const swallowedErrorMessages: string[] = []
    const onRequestDone = () => {
      swallowedErrorMessages.forEach((errMsg) => {
        if (!loggedErrors.some((err) => String(err).includes(errMsg))) {
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
  return true
}

function getAsyncHookStore(): null | undefined | AsyncHookStore {
  if (asyncLocalStorage === null) return null
  const store = asyncLocalStorage.getStore()
  assert(store === undefined || isObject(store))
  return store
}
