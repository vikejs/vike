export { isVikeCliOrApi }
// export { getOperation }
export { setOperation as setOperation }

import type { Operation } from './types.js'
import { assert } from './utils.js'

let apiOperation: Operation | undefined

function getOperation(): Operation {
  assert(apiOperation)
  return apiOperation
}
function isVikeCliOrApi(): boolean {
  // The CLI uses the API
  return !!apiOperation
}
function setOperation(operation: Operation): void {
  assert(!apiOperation)
  apiOperation = operation
}
