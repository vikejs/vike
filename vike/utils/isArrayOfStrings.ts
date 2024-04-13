export { isArrayOfStrings }

import { isArray } from './isArray.js'

function isArrayOfStrings(val: unknown): val is string[] {
  return isArray(val) && val.every((v) => typeof v === 'string')
}
