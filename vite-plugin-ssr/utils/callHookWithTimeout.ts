export { callHookWithTimeout }

import { errorPrefix, getProjectError } from './assert'
import { humanizeTime } from './humanizeTime'

type HookName = 'render' | 'onBeforeRender' | 'onBeforePrerender' | 'onBeforeRoute' | 'onHydrationEnd'

function callHookWithTimeout<T>(call: () => T, hookName: HookName, hookFilePath: string): Promise<T> {
  const { timeoutErr, timeoutWarn } = getTimeouts(hookName)

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
    clearTimeout(t1)
    clearTimeout(t2)
  }
  const t1 = setTimeout(() => {
    const msg = `${errorPrefix}[Slow Hook] The ${hookName}() hook of ${hookFilePath} is taking more than ${humanizeTime(
      timeoutErr
    )}`
    console.warn(msg)
  }, timeoutErr)
  const t2 = setTimeout(() => {
    const err = getProjectError(
      `[Hook Timeout] The ${hookName}() hook of ${hookFilePath} didn't finish after ${humanizeTime(timeoutWarn)}`
    )
    reject(err)
  }, timeoutWarn)

  ;(async () => {
    try {
      const ret = await call()
      resolve(ret)
    } catch (err) {
      reject(err)
    }
  })()

  return promise
}

function getTimeouts(hookName: HookName) {
  let timeoutErr = 20 * 1000
  let timeoutWarn = 4 * 1000
  if (hookName === 'onBeforeRoute') {
    timeoutErr = 5 * 1000
    timeoutWarn = 1 * 1000
  }
  if (hookName === 'onBeforePrerender') {
    timeoutErr = 60 * 1000
    timeoutWarn = 30 * 1000
  }
  return { timeoutErr, timeoutWarn }
}
