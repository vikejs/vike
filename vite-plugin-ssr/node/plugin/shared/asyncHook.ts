// Bun doesn't support Async Hooks: https://github.com/oven-sh/bun/issues/1832
// Do we foresee other JavaScript server runtimes that won't support Async Hooks?

export { installAsyncHook }
export { getAsyncHookStore }

import { renderPage_setWrapper } from '../../runtime/renderPage'
import { assert, isObject } from '../utils'
import type { AsyncLocalStorage as AsyncLocalStorageType } from 'node:async_hooks'
import { getConfigBuildErrFormatted } from '../plugins/importUserCode/v1-design/transpileAndLoadFile'
import { logErrorDebugNote } from './loggerNotProd'

type AsyncHookStore = {
  httpRequestId: number
  // Error swallowing mechanism
  addLoggedError: (err: unknown) => void
  addSwallowedErrorMessage: (errMsg: string) => void
  shouldErrorBeSwallowed: (err: unknown) => boolean
  errorDebugNoteAlreadyShown: boolean
}
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
    const addLoggedError = (err: unknown) => {
      loggedErrors.add(err)
    }
    const shouldErrorBeSwallowed = (err: unknown) => {
      if (
        loggedErrors.has(err) ||
        Array.from(loggedErrors).some((errAlreadyLogged) => isEquivalentOrSubset(err, errAlreadyLogged))
      ) {
        // In principle, some random message can be shown between the non-swallowed error and logErrorDebugNote()
        // We take leap of faith that it doesn't happen often and that it's worth the risk
        logErrorDebugNote()
        return true
      } else {
        return false
      }
    }
    assert(asyncLocalStorage)

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
    const addSwallowedErrorMessage = (errMsg: string) => {
      swallowedErrorMessages.add(errMsg)
    }

    const store = {
      httpRequestId,
      addLoggedError,
      addSwallowedErrorMessage,
      shouldErrorBeSwallowed,
      errorDebugNoteAlreadyShown: false
    }

    const pageContextReturn = await asyncLocalStorage.run(store, renderPage)
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

function isEquivalentOrSubset(err: unknown, errAlreadyLogged: unknown) {
  const err1 = err
  const err2 = errAlreadyLogged

  if (err1 === err2) return true
  if (!isObject(err1) || !isObject(err2)) return false

  {
    const esbuildErrMsg1 = getConfigBuildErrFormatted(err1)
    const esbuildErrMsg2 = getConfigBuildErrFormatted(err2)
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
