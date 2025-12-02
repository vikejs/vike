// TODO: refactor
// - rename this file
// - move this file to /server/runtime/
// - rename HttpRequestAsyncStore

// Purpose of this file:
//  - Swallow redundant error messages (Vite is buggy and emits the same error multiple times)
//  - Prepend "[request(n)]" tag to Vite logs

// The mechanism is skipped if the development environment doesn't support Async Hooks.

// We purposely don't use config.logger.hasErrorLogged(err) because:
// - We don't trust Vite with such details
//   - Example of Vite bug leading to swallowing of errors: https://github.com/vitejs/vite/issues/12631
// - We dedupe errors ourself with getHttpRequestAsyncStore().shouldErrorBeSwallowed()

export { getPageContext_withAsyncHook }
export { getHttpRequestId_withAsyncHook }
export { installHttpRequestAsyncStore }
export type { HttpRequestAsyncStore as AsyncStore }

import {
  type PageContextBegin,
  renderPageServer_addAsyncHookwrapper,
} from '../../../server/runtime/renderPageServer.js'
import { preparePageContextForPublicUsageServer } from '../../../server/runtime/renderPageServer/preparePageContextForPublicUsageServer.js'
import { assert, assertIsNotBrowser, getGlobalObject, isObject } from '../../../server/utils.js'
import type { AsyncLocalStorage as AsyncLocalStorageType } from 'node:async_hooks'
import { import_ } from '@brillout/import'

assertIsNotBrowser()

type HttpRequestAsyncStore = null | {
  httpRequestId: number
  pageContext?: PageContextBegin
}
const globalObject = getGlobalObject('getHttpRequestAsyncStore.ts', {
  asyncLocalStorage: null as AsyncLocalStorageType<HttpRequestAsyncStore> | null,
})

async function installHttpRequestAsyncStore(): Promise<void> {
  let mod: typeof import('node:async_hooks')
  try {
    mod = await import_('node:async_hooks')
  } catch {
    return
  }
  globalObject.asyncLocalStorage = new mod.AsyncLocalStorage()
  renderPageServer_addAsyncHookwrapper(async (httpRequestId, renderPageServer) => {
    assert(globalObject.asyncLocalStorage)

    // TODO: rename to asyncStore
    const store = {
      httpRequestId,
    } satisfies HttpRequestAsyncStore
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
  // If it's already a proxy (set by execHook), return it directly
  if ((pageContext as any)._isProxyObject) return pageContext
  // Otherwise create a new proxy (for backwards compatibility)
  return preparePageContextForPublicUsageServer(pageContext as any)
}
