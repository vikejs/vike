import { isObject } from './isObject'
import { deepEqual } from './deepEqual'

export { isEquivalentError }

function isEquivalentError(err1: unknown, err2: unknown) {
  return (
    isObject(err1) &&
    isObject(err2) &&
    err1.constructor === err2.constructor &&
    deepEqual(err1, err2) &&
    // message and stack are non-emurable
    err2.message === err2.message &&
    err2.stack === err2.stack
  )
}
