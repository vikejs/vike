export { installAsyncHook }
export { getAsyncHookStore }

import { renderPage_setWrapper } from '../../runtime/renderPage'
import type { AsyncLocalStorage as AsyncLocalStorageType } from 'node:async_hooks'
import { assert, isObject } from '../utils'

type AsyncHookStore = { httpRequestId: number; loggedErrors2: unknown[] }
let asyncLocalStorage: null | AsyncLocalStorageType<AsyncHookStore> = null

async function installAsyncHook(): Promise<boolean> {
  let mod: typeof import('node:async_hooks')
  try {
    mod = await import('node:async_hooks')
  } catch {
    return false
  }
  asyncLocalStorage = new mod.AsyncLocalStorage()
  renderPage_setWrapper((httpRequestId, renderPage) => {
    assert(asyncLocalStorage)
    return asyncLocalStorage.run({ httpRequestId, loggedErrors2: [] }, renderPage)
  })
  return true
}

function getAsyncHookStore(): null | undefined | AsyncHookStore {
  if (asyncLocalStorage === null) return null
  const store = asyncLocalStorage.getStore()
  assert(store === undefined || isObject(store))
  return store
}
