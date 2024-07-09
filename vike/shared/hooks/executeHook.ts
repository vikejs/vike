export { executeHook }
export { getPageContext }
export { isUserHookError }

import { getProjectError, assertWarning } from '../../utils/assert.js'
import { getGlobalObject } from '../../utils/getGlobalObject.js'
import { humanizeTime } from '../../utils/humanizeTime.js'
import { isObject } from '../../utils/isObject.js'
import type { PageContextClient, PageContextServer } from '../types.js'
import type { Hook, HookLoc } from './getHook.js'
const globalObject = getGlobalObject('utils/executeHook.ts', {
  userHookErrors: new WeakMap<object, HookLoc>(),
  pageContext: null as PageContextUnknown
})

type PageContextUnknown = null | Record<string, unknown>

function isUserHookError(err: unknown): false | HookLoc {
  if (!isObject(err)) return false
  return globalObject.userHookErrors.get(err) ?? false
}

function executeHook<T = unknown>(
  hookFnCaller: () => T,
  hook: Omit<Hook, 'hookFn'>,
  pageContext: PageContextUnknown
): Promise<T> {
  const {
    hookName,
    hookFilePath,
    hookTimeout: { error: timeoutErr, warning: timeoutWarn }
  } = hook

  let resolve!: (ret: T) => void
  let reject!: (err: unknown) => void
  const promise = new Promise<T>((resolve_, reject_) => {
    resolve = (ret) => {
      clearTimeouts()
      resolve_(ret)
    }
    reject = (err) => {
      clearTimeouts()
      reject_(err)
    }
  })

  const clearTimeouts = () => {
    if (currentTimeoutWarn) clearTimeout(currentTimeoutWarn)
    if (currentTimeoutErr) clearTimeout(currentTimeoutErr)
  }
  const currentTimeoutWarn =
    isNotDisabled(timeoutWarn) &&
    setTimeout(() => {
      assertWarning(
        false,
        `The ${hookName}() hook defined by ${hookFilePath} is slow: it's taking more than ${humanizeTime(
          timeoutWarn
        )} (https://vike.dev/hooksTimeout)`,
        { onlyOnce: false }
      )
    }, timeoutWarn)
  const currentTimeoutErr =
    isNotDisabled(timeoutErr) &&
    setTimeout(() => {
      const err = getProjectError(
        `The ${hookName}() hook defined by ${hookFilePath} timed out: it didn't finish after ${humanizeTime(
          timeoutErr
        )} (https://vike.dev/hooksTimeout)`
      )
      reject(err)
    }, timeoutErr)
  ;(async () => {
    try {
      providePageContext(pageContext)
      const ret = await hookFnCaller()
      resolve(ret)
    } catch (err) {
      if (isObject(err)) {
        globalObject.userHookErrors.set(err, { hookName, hookFilePath })
      }
      reject(err)
    }
  })()

  return promise
}

function isNotDisabled(timeout: false | number): timeout is number {
  return !!timeout && timeout !== Infinity
}

/**
 * Access `pageContext` object inside Vike hooks, in order to create universal hooks.
 *
 * https://vike.dev/getPageContext
 */
function getPageContext<PageContext = PageContextClient | PageContextServer>(): null | PageContext {
  return globalObject.pageContext as any
}
function providePageContext(pageContext: PageContextUnknown) {
  globalObject.pageContext = pageContext
  // Promise.resolve() is quicker than process.nextTick() and setImmediate()
  // https://stackoverflow.com/questions/67949576/process-nexttick-before-promise-resolve-then
  Promise.resolve().then(() => {
    globalObject.pageContext = null
  })
}
