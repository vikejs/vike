export { getPageContext_withAsyncHook }
export { getHttpRequestId_withAsyncHook }
export type { AsyncStore }

import { preparePageContextForPublicUsageServer } from './renderPageServer/preparePageContextForPublicUsageServer.js'
import { type PageContextBegin, renderPageServer_addAsyncHookwrapper } from './renderPageServer.js'
import { assert, assertIsNotBrowser, getGlobalObject, isObject } from '../utils.js'
import type { AsyncLocalStorage as AsyncLocalStorageType } from 'node:async_hooks'
import { import_ } from '@brillout/import'

assertIsNotBrowser()
type AsyncStore = null | {
  httpRequestId: number
  pageContext?: PageContextBegin
}
const globalObject = getGlobalObject('server/runtime/asyncHook.ts', {
  asyncLocalStorage: null as AsyncLocalStorageType<AsyncStore> | null,
  installPromise: null as Promise<void> | null,
})
globalObject.installPromise = install()

async function install(): Promise<void> {
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
    const asyncStore: AsyncStore = {
      httpRequestId,
    }
    const pageContextReturn = await globalObject.asyncLocalStorage.run(asyncStore, () => renderPageServer(asyncStore))
    return { pageContextReturn }
  })
  return
}

function getAsyncStore() {
  if (globalObject.asyncLocalStorage === null) return null
  const asyncStore = globalObject.asyncLocalStorage.getStore()
  assert(asyncStore === undefined || isObject(asyncStore))
  return asyncStore ?? null
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
