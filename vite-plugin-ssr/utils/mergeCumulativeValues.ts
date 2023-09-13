export { mergeCumulativeValues }

import { assert } from './assert.js'

function mergeCumulativeValues(values: unknown[]): null | unknown[] | Set<unknown> {
  if (values.length === 0) return null
  if (values.every((v) => v instanceof Set)) {
    return new Set(
      values
        .map((v) => {
          assert(v instanceof Set)
          return [...v]
        })
        .flat()
    )
  }
  if (values.every((v) => Array.isArray(v))) {
    return values.flat()
  }
  return null
}
