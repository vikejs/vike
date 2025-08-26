export { isVikeCliOrApi }
export { setContextVikeApiOperation }
export { clearContextVikeApiOperation }
export { getVikeApiOperation }

import type { ApiOptions, ApiOperation } from './types.js'
import { assert, getGlobalObject } from './utils.js'
const globalObject = getGlobalObject<{ vikeApiOperation?: VikeApiOperation }>('api/context.ts', {})

type VikeApiOperation = { operation: ApiOperation; options: ApiOptions }
function getVikeApiOperation(): VikeApiOperation | null {
  return globalObject.vikeApiOperation ?? null
}
function isVikeCliOrApi(): boolean {
  // The CLI uses the API
  return !!globalObject.vikeApiOperation
}
function setContextVikeApiOperation(operation: ApiOperation, options: ApiOptions): void {
  assert(!globalObject.vikeApiOperation)
  globalObject.vikeApiOperation = { operation, options }
}
function clearContextVikeApiOperation(): void {
  globalObject.vikeApiOperation = undefined
}
