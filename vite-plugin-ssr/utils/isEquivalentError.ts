import { isObject } from './isObject.js'
import { deepEqual } from './deepEqual.js'

export { isEquivalentError }

function isEquivalentError(err1: unknown, err2: unknown) {
  return (
    isObject(err1) &&
    isObject(err2) &&
    err1.constructor === err2.constructor &&
    deepEqual({ ...err1, stack: null }, { ...err2, stack: null }) &&
    // 'message' and 'stack' are usually non-emurable
    err2.message === err2.message
    /* Doesn't work because: the stack trace isn't exactly the same between the original page rendering and the fallback error page rendering
    err2.stack === err2.stack
    */
  )
}
