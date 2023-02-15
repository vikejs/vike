export { markAsServerRuntime }
export { markAsNotServerRuntime }

import { assert } from './assert'
import { getGlobalObject } from './getGlobalObject'

const globalObject = getGlobalObject<{
  isServerRuntime?: boolean
}>('utils/isServerRuntime.ts', {})

function markAsNotServerRuntime(): void | undefined {
  assert(globalObject.isServerRuntime !== true)
  globalObject.isServerRuntime = false
}
function markAsServerRuntime(): void | undefined {
  assert(globalObject.isServerRuntime !== false)
  globalObject.isServerRuntime = true
}
