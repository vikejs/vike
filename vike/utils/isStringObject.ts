export { isStringObject }

import { isObject } from './isObject.js'

function isStringObject(val: unknown): val is Record<string, string> {
  return isObject(val) && Object.values(val).every((v) => typeof v === 'string')
}
