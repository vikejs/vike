// Bun doesn't support Async Hooks: https://github.com/oven-sh/bun/issues/1832
// Do we foresee other JavaScript server runtimes that won't support Async Hooks?

export { installAsyncHook }
export { getAsyncHookStore }

import { renderPage_setWrapper } from '../../runtime/renderPage'
import { assert, isObject } from '../utils'
import type { AsyncLocalStorage as AsyncLocalStorageType } from 'node:async_hooks'
import { esbuildFormattedMessageKey } from './loggerTranspile/formatEsbuildError'

type AsyncHookStore = {
  httpRequestId: number
  addLoggedError: (err: unknown) => void
  hasErrorLogged: (err: unknown) => boolean
  addSwallowedErrorMessage: (errMsg: string) => void
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
    const hasErrorLogged = (err: unknown) => {
      if (loggedErrors.has(err)) return true
      if (Array.from(loggedErrors).some((errAlreadyLogged) => isEquivalentOrSubset(err, errAlreadyLogged))) return true
      return false
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

    const pageContextReturn = await asyncLocalStorage.run(
      { httpRequestId, addLoggedError, hasErrorLogged, addSwallowedErrorMessage },
      renderPage
    )
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

  if (
    isDefinedAndSame(err1.message, err2.message) &&
    isDefinedAndSame(err1.frame, err2.frame) &&
    isDefinedAndSame(err1.id, err2.id) &&
    isUndefinedOrSame(err1[esbuildFormattedMessageKey], err2[esbuildFormattedMessageKey])
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
function isUndefinedOrSame(val1: unknown, val2: unknown) {
  return (val1 === undefined && val2 === undefined) || val1 === val2
}
