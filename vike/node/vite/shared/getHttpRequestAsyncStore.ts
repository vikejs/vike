// Purpose of this file:
//  - Swallow redundant error messages (Vite is buggy and emits the same error multiple times)
//  - Prepend "[request(n)]" tag to Vite logs

// The mechanism is skipped if the development environment doesn't support Async Hooks.

// We purposely don't use config.logger.hasErrorLogged(err) because:
// - We don't trust Vite with such details
//   - Example of Vite bug leading to swallowing of errors: https://github.com/vitejs/vite/issues/12631
// - We dedupe errors ourself with getHttpRequestAsyncStore().shouldErrorBeSwallowed()

export { getHttpRequestAsyncStore }
export { installHttpRequestAsyncStore }

import { renderPage_addAsyncHookwrapper } from '../../runtime/renderPage.js'
import { assert, assertIsNotProductionRuntime, isObject, unique } from '../utils.js'
import type { AsyncLocalStorage as AsyncLocalStorageType } from 'node:async_hooks'
import { getConfigBuildErrorFormatted } from './resolveVikeConfigInternal/transpileAndExecuteFile.js'
import { logErrorDebugNote } from './loggerNotProd.js'
import { isEquivalentErrorWithCodeSnippet } from './loggerNotProd/errorWithCodeSnippet.js'
import { isDeepStrictEqual } from 'node:util'

assertIsNotProductionRuntime()

type HttpRequestAsyncStore = {
  httpRequestId: number
  // Error swallowing mechanism
  shouldErrorBeSwallowed: (err: unknown) => boolean
  markErrorAsLogged: (err: unknown) => void
  errorDebugNoteAlreadyShown: boolean
}
let asyncLocalStorage: null | AsyncLocalStorageType<HttpRequestAsyncStore> = null

async function installHttpRequestAsyncStore(): Promise<void> {
  let mod: typeof import('node:async_hooks')
  try {
    mod = await import('node:async_hooks')
  } catch {
    return
  }
  asyncLocalStorage = new mod.AsyncLocalStorage()
  renderPage_addAsyncHookwrapper(async (httpRequestId, renderPage) => {
    assert(asyncLocalStorage)

    const loggedErrors = new Set<unknown>()
    const markErrorAsLogged = (err: unknown) => {
      loggedErrors.add(err)
    }

    const shouldErrorBeSwallowed = (err: unknown) => {
      if (
        loggedErrors.has(err) ||
        Array.from(loggedErrors).some((errAlreadyLogged) => isEquivalent(err, errAlreadyLogged))
      ) {
        // In principle, some random message can be shown between the non-swallowed error and this logErrorDebugNote() call.
        // We take a leap of faith that it happens only seldomly and that it's worth the risk.
        logErrorDebugNote()
        return true
      } else {
        return false
      }
    }

    const store = {
      httpRequestId,
      markErrorAsLogged,
      shouldErrorBeSwallowed,
      errorDebugNoteAlreadyShown: false
    }
    const pageContextReturn = await asyncLocalStorage.run(store, renderPage)
    return { pageContextReturn }
  })
  return
}

function getHttpRequestAsyncStore(): null | undefined | HttpRequestAsyncStore {
  if (asyncLocalStorage === null) return null
  const store = asyncLocalStorage.getStore()
  assert(store === undefined || isObject(store))
  return store
}

function isEquivalent(err1: unknown, err2: unknown) {
  if (err1 === err2) return true
  if (!isObject(err1) || !isObject(err2)) return false

  {
    const errMsgFormatted1 = getConfigBuildErrorFormatted(err1)
    const errMsgFormatted2 = getConfigBuildErrorFormatted(err2)
    if (errMsgFormatted1 && errMsgFormatted1 === errMsgFormatted2) return true
  }

  if (isEquivalentErrorWithCodeSnippet(err1, err2)) return true

  if (
    unique([
      // error.message and error.stack aren't enumerable and therefore not listed by Object.keys()
      'message',
      'stack',
      ...Object.keys(err1),
      ...Object.keys(err2)
    ]).every((k) => {
      // isDeepStrictEqual() need to compare error.position wich is an object.
      if (isDeepStrictEqual(err1[k], err2[k])) return true
      // console.log('diff', k)
      return false
    })
  ) {
    return true
  }

  return false
}
