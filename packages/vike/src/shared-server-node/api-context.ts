export { isVikeCliOrApi }
export { setContextVikeApiOperation }
export { clearContextVikeApiOperation }
export { getVikeApiOperation }

import type { ApiOptions, ApiOperation } from '../node/api/types.js'
// We don't import ./utils.js because this file is imported by server/
import { assert } from '../utils/assert.js'
import { getGlobalObject } from '../utils/getGlobalObject.js'
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
