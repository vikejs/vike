export { isVikeCliOrApi }
export { setContextApiOperation }
export { clearContextApiOperation }
// export { getApiOperation }

import type { Operation } from './types.js'
import { assert, getGlobalObject } from './utils.js'
const globalObject = getGlobalObject<{ apiOperation?: Operation }>('api/context.ts', {})

function getApiOperation(): Operation {
  assert(globalObject.apiOperation)
  return globalObject.apiOperation
}
function isVikeCliOrApi(): boolean {
  // The CLI uses the API
  return !!globalObject.apiOperation
}
function setContextApiOperation(operation: Operation): void {
  assert(!globalObject.apiOperation)
  globalObject.apiOperation = operation
}
function clearContextApiOperation(): void {
  globalObject.apiOperation = undefined
}
