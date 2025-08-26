export { isVikeCliOrApi }
export { setContextVikeApiOperation }
export { clearContextVikeApiOperation }
export { getVikeApiOperation }

import type { APIOptions, Operation } from './types.js'
import { assert, getGlobalObject } from './utils.js'
const globalObject = getGlobalObject<{ apiOperation?: VikeApiOperation }>('api/context.ts', {})

type VikeApiOperation = { operation: Operation; options: APIOptions }
function getVikeApiOperation(): VikeApiOperation | null {
  return globalObject.apiOperation ?? null
}
function isVikeCliOrApi(): boolean {
  // The CLI uses the API
  return !!globalObject.apiOperation
}
function setContextVikeApiOperation(operation: Operation, options: APIOptions): void {
  assert(!globalObject.apiOperation)
  globalObject.apiOperation = { operation, options }
}
function clearContextVikeApiOperation(): void {
  globalObject.apiOperation = undefined
}
