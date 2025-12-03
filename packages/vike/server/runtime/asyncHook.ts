// TODO: refactor
// - rename HttpRequestAsyncStore

export { getPageContext_withAsyncHook }
export { getHttpRequestId_withAsyncHook }
export type { HttpRequestAsyncStore as AsyncStore }

import { preparePageContextForPublicUsageServer } from './renderPageServer/preparePageContextForPublicUsageServer.js'
import { type PageContextBegin, renderPageServer_addAsyncHookwrapper } from './renderPageServer.js'
import { assert, assertIsNotBrowser, getGlobalObject, isObject } from '../utils.js'
import type { AsyncLocalStorage as AsyncLocalStorageType } from 'node:async_hooks'
import { import_ } from '@brillout/import'

assertIsNotBrowser()
type HttpRequestAsyncStore = null | {
  httpRequestId: number
  pageContext?: PageContextBegin
}
const globalObject = getGlobalObject('server/runtime/asyncHook.ts', {
  asyncLocalStorage: null as AsyncLocalStorageType<HttpRequestAsyncStore> | null,
  installPromise: null as Promise<void> | null,
})
globalObject.installPromise = installHttpRequestAsyncStore()

// TODO: rename
async function installHttpRequestAsyncStore(): Promise<void> {
  let mod: typeof import('node:async_hooks')
  try {
    mod = await import_('node:async_hooks')
  } catch {
    return
  }
  globalObject.asyncLocalStorage = new mod.AsyncLocalStorage()
  // TODO: try to call renderPageServer_addAsyncHookwrapper() earlier before promise above
  renderPageServer_addAsyncHookwrapper(async (httpRequestId, renderPageServer) => {
    assert(globalObject.asyncLocalStorage)
    await globalObject.installPromise
    // TODO: rename to asyncStore
    const store: HttpRequestAsyncStore = {
      httpRequestId,
    }
    const pageContextReturn = await globalObject.asyncLocalStorage.run(store, () => renderPageServer(store))
    return { pageContextReturn }
  })
  return
}

function getAsyncStore() {
  if (globalObject.asyncLocalStorage === null) return null
  const store = globalObject.asyncLocalStorage.getStore()
  assert(store === undefined || isObject(store))
  return store ?? null
}

function getHttpRequestId_withAsyncHook() {
  const asyncStore = getAsyncStore()
  return asyncStore?.httpRequestId ?? null
}

function getPageContext_withAsyncHook() {
  const asyncStore = getAsyncStore()
  const pageContext = asyncStore?.pageContext
  if (!pageContext) return null
  return preparePageContextForPublicUsageServer(pageContext as any)
}
