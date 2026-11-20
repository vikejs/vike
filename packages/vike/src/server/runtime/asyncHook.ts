export { getPageContext_withAsyncHook }
export { getPageContextProvided_withAsyncHook }
export { providePageContext_withAsyncHook }
export { getRequestId_withAsyncHook }
export { getAsyncLocalStorage }
export type { AsyncStore }

import { getPageContextPublicServer } from './renderPageServer/getPageContextPublicServer.js'
import { assert } from '../../utils/assert.js'
import { getGlobalObject } from '../../utils/getGlobalObject.js'
import { isObject } from '../../utils/isObject.js'
import type { PageContextClient, PageContextServer } from '../../types/PageContext.js'
import type { AsyncLocalStorage as AsyncLocalStorageType } from 'node:async_hooks'
import { import_ } from '@brillout/import'
import '../assertEnvServer.js'

type AsyncStore = null | {
  requestId: number
  pageContext?: Record<string, unknown>
  pageContextProvided?: null | PageContextClient | PageContextServer
}
const globalObject = getGlobalObject('server/runtime/asyncHook.ts', {
  asyncLocalStorage: null as AsyncLocalStorageType<AsyncStore> | null,
  installPromise: install(),
})

async function install(): Promise<void> {
  let mod: typeof import('node:async_hooks')
  try {
    mod = await import_('node:async_hooks')
  } catch {
    return
  }
  globalObject.asyncLocalStorage = new mod.AsyncLocalStorage()
}

async function getAsyncLocalStorage() {
  await globalObject.installPromise
  return globalObject.asyncLocalStorage
}

function getAsyncStore() {
  if (globalObject.asyncLocalStorage === null) return null
  const asyncStore = globalObject.asyncLocalStorage.getStore()
  assert(asyncStore === undefined || isObject(asyncStore))
  return asyncStore ?? null
}

function getRequestId_withAsyncHook() {
  const asyncStore = getAsyncStore()
  return asyncStore?.requestId ?? null
}

function getPageContext_withAsyncHook() {
  const asyncStore = getAsyncStore()
  const pageContext = asyncStore?.pageContext
  if (!pageContext) return null
  return getPageContextPublicServer(pageContext as any)
}

function getPageContextProvided_withAsyncHook() {
  const asyncStore = getAsyncStore()
  return asyncStore?.pageContextProvided ?? null
}

function providePageContext_withAsyncHook(pageContext: null | PageContextClient | PageContextServer): boolean {
  const asyncStore = getAsyncStore()
  if (!asyncStore) return false
  asyncStore.pageContextProvided = pageContext
  // `pageContextProvided` is for the hook the extension calls next — not for what the request runs later, e.g. a component rendered upon HTML streaming
  Promise.resolve().then(() => {
    asyncStore.pageContextProvided = null
  })
  return true
}
