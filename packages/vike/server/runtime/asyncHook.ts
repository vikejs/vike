export { getPageContext_withAsyncHook }
export { getHttpRequestId_withAsyncHook }
export { getAsyncLocalStorage }
export type { AsyncStore }

import { preparePageContextForPublicUsageServer } from './renderPageServer/preparePageContextForPublicUsageServer.js'
import { assert, assertIsNotBrowser, getGlobalObject, isObject } from '../utils.js'
import type { AsyncLocalStorage as AsyncLocalStorageType } from 'node:async_hooks'
import { import_ } from '@brillout/import'

assertIsNotBrowser()
type AsyncStore = null | {
  httpRequestId: number
  pageContext?: Record<string, unknown>
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
