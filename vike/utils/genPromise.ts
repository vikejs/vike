export { genPromise }

// Simple implementation without timeout: https://github.com/vikejs/vike/blob/2e59b922e7e0f227d26018dc2b74877c9b0f581b/vike/utils/genPromise.ts

import { assert, assertWarning } from './assert.js'

const timeoutSecondsDefault = 25

function genPromise<T = void>({
  timeout: timeoutSeconds = timeoutSecondsDefault as number | null,
} = {}): {
  promise: Promise<T>
  resolve: (val: T) => void
  reject: (err: unknown) => void
} {
  let resolve!: (val: T) => void
  let reject!: (err: unknown) => void
  let finished = false
  const promise_internal = new Promise<T>((resolve_, reject_) => {
    resolve = (...args) => {
      finished = true
      timeoutClear()
      return resolve_(...args)
    }
    reject = (...args) => {
      finished = true
      timeoutClear()
      return reject_(...args)
    }
  })

  const timeoutClear = () => timeouts.forEach((t) => clearTimeout(t))
  const timeouts: ReturnType<typeof setTimeout>[] = []
  let promise: typeof promise_internal
  if (!timeoutSeconds) {
    promise = promise_internal
  } else {
    promise = new Proxy(promise_internal, {
      get(target, prop) {
        if (prop === 'then' && !finished) {
          const err = new Error(`Promise hasn't resolved after ${timeoutSeconds} seconds`)
          timeouts.push(
            setTimeout(() => {
              assert(err.stack)
              assertWarning(false, removeStackErrorPrefix(err.stack), { onlyOnce: false })
            }, timeoutSeconds * 1000),
          )
        }
        const value = Reflect.get(target, prop)
        return typeof value === 'function' ? value.bind(target) : value
      },
    })
  }

  return { promise, resolve, reject }
}

function removeStackErrorPrefix(errStack: string) {
  const errorPrefix = 'Error: '
  if (errStack.startsWith(errorPrefix)) errStack = errStack.slice(errorPrefix.length)
  return errStack
}
