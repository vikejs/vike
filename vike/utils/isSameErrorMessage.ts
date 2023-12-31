import { isObject } from './isObject.js'

export { isSameErrorMessage }

function isSameErrorMessage(err1: unknown, err2: unknown): boolean {
  if (!isObject(err1) || !isObject(err2)) return false
  return err1.message === err2.message
}
