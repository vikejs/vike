export { isArrayOfStrings }

import { isArray } from './isArray'

function isArrayOfStrings(val: unknown): val is string[] {
  return isArray(val) && val.every((v) => typeof v === 'string')
}
