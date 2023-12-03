export { executeHook }
export { isUserHookError }

import { getProjectError, assertWarning } from '../../utils/assert.js'
import { getGlobalObject } from '../../utils/getGlobalObject.js'
import { humanizeTime } from '../../utils/humanizeTime.js'
import { isObject } from '../../utils/isObject.js'
import type { Hook, HookLoc } from './getHook.js'

const globalObject = getGlobalObject('utils/executeHook.ts', {
  userHookErrors: new Map<object, HookLoc>()
})

function isUserHookError(err: unknown): false | HookLoc {
  if (!isObject(err)) return false
  return globalObject.userHookErrors.get(err) ?? false
}

function executeHook<T = unknown>(hookFnCaller: () => T, hook: Omit<Hook, 'hookFn'>): Promise<T> {
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
    isNumberReal(timeoutWarn) &&
    setTimeout(() => {
      assertWarning(
        false,
        `The ${hookName}() hook defined by ${hookFilePath} is taking more than ${humanizeTime(timeoutWarn)}`,
        { onlyOnce: false }
      )
    }, timeoutWarn)
  const currentTimeoutErr =
    isNumberReal(timeoutErr) &&
    setTimeout(() => {
      const err = getProjectError(
        `Hook timeout: the ${hookName}() hook defined by ${hookFilePath} didn't finish after ${humanizeTime(
          timeoutErr
        )}`
      )
      reject(err)
    }, timeoutErr)

  ;(async () => {
    try {
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

function isNumberReal(timeout: false | number): timeout is number {
  return !!timeout && timeout !== Infinity
}
