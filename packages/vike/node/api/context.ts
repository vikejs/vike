export { isVikeCliOrApi }
export { setContextApiOperation }
export { clearContextApiOperation }
export { getApiOperation }

import type { APIOptions, Operation } from './types.js'
import { assert, getGlobalObject } from './utils.js'
const globalObject = getGlobalObject<{ apiOperation?: ApiOperation }>('api/context.ts', {})

type ApiOperation = { operation: Operation; options: APIOptions }
function getApiOperation(): ApiOperation | null {
  return globalObject.apiOperation ?? null
}
function isVikeCliOrApi(): boolean {
  // The CLI uses the API
  return !!globalObject.apiOperation
}
function setContextApiOperation(operation: Operation, options: APIOptions): void {
  assert(!globalObject.apiOperation)
  globalObject.apiOperation = { operation, options }
}
function clearContextApiOperation(): void {
  globalObject.apiOperation = undefined
}
