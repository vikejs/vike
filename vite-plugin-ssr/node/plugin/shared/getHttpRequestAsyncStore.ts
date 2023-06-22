// Purpose of this file:
//  - Prepend '[request(n)]' message tag to Vite log messages
//  - Swallow redundant error messages (Vite is buggy and emits the same error multiple times)

// The mechanism is skipped if the runtime doesn't support Async Hooks:
//  - Bun doesn't support Async Hooks: https://github.com/oven-sh/bun/issues/1832
//  - Node.js and Deno support Async Hooks

export { getHttpRequestAsyncStore }
export { installHttpRequestAsyncStore }

import { renderPage_setWrapper } from '../../runtime/renderPage'
import { assert, isObject } from '../utils'
import type { AsyncLocalStorage as AsyncLocalStorageType } from 'node:async_hooks'
import { getConfigBuildErrorFormatted } from '../plugins/importUserCode/v1-design/transpileAndLoadFile'
import { logErrorDebugNote } from './loggerNotProd'

type HttpRequestAsyncStore = {
  httpRequestId: number
  // Error swallowing mechanism
  shouldErrorBeSwallowed: (err: unknown) => boolean
  markErrorAsLogged: (err: unknown) => void
  markErrorMessageAsLogged: (errMsg: string) => void
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
  renderPage_setWrapper(async (httpRequestId, renderPage) => {
    const loggedErrors = new Set<unknown>()
    const markErrorAsLogged = (err: unknown) => {
      loggedErrors.add(err)
    }
    const shouldErrorBeSwallowed = (err: unknown) => {
      if (
        loggedErrors.has(err) ||
        Array.from(loggedErrors).some((errAlreadyLogged) => isEquivalentOrSubset(err, errAlreadyLogged))
      ) {
        // In principle, some random message can be shown between the non-swallowed error and this logErrorDebugNote() call.
        // We take a leap of faith that it happens only seldomly and that it's worth the risk.
        logErrorDebugNote()
        return true
      } else {
        return false
      }
    }
    assert(asyncLocalStorage)

    // Remove this once https://github.com/vitejs/vite/pull/13495 is released
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
    const markErrorMessageAsLogged = (errMsg: string) => {
      swallowedErrorMessages.add(errMsg)
    }

    const store = {
      httpRequestId,
      markErrorAsLogged,
      markErrorMessageAsLogged,
      shouldErrorBeSwallowed,
      errorDebugNoteAlreadyShown: false
    }
    const pageContextReturn = await asyncLocalStorage.run(store, renderPage)
    return { pageContextReturn, onRequestDone }
  })
  return
}

function getHttpRequestAsyncStore(): null | undefined | HttpRequestAsyncStore {
  if (asyncLocalStorage === null) return null
  const store = asyncLocalStorage.getStore()
  assert(store === undefined || isObject(store))
  return store
}

function isEquivalentOrSubset(err: unknown, errAlreadyLogged: unknown) {
  const err1 = err
  const err2 = errAlreadyLogged

  if (err1 === err2) return true
  if (!isObject(err1) || !isObject(err2)) return false

  {
    const esbuildErrMsg1 = getConfigBuildErrorFormatted(err1)
    const esbuildErrMsg2 = getConfigBuildErrorFormatted(err2)
    if (esbuildErrMsg1 && esbuildErrMsg1 === esbuildErrMsg2) return true
  }

  if (
    isDefinedAndSame(err1.message, err2.message) &&
    isDefinedAndSame(err1.frame, err2.frame) &&
    isDefinedAndSame(err1.id, err2.id)
  ) {
    return true
  }

  if (
    err1.constructor === (Error as any) &&
    Object.keys(err1).length === 0 &&
    isDefinedAndSame(err1.message, err2.message) &&
    isDefinedAndSame(err1.stack, err2.stack)
  ) {
    return true
  }

  return false
}
function isDefinedAndSame(val1: unknown, val2: unknown) {
  return val1 && val1 === val2
}
