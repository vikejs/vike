export { getGlobalObject }
export { assertIsSingleModuleInstance }

import { assert } from './assert.js'
import type { VikeGlobalInternal } from '../types/VikeGlobalInternal.js'

// We use the file name and file directory as key: there should be only one getGlobalObject() usage per file.
type ModuleId = `${string}.ts`

/** Share information across module instances. */
function getGlobalObject<T extends Record<string, unknown> = never>(moduleId: ModuleId, defaultValue: T): T {
  const globals = getGlobals()
  const globalObject = (globals[moduleId] ??= defaultValue)
  return globalObject as T
}

/** Assert that the module is instantiated only once. */
function assertIsSingleModuleInstance(moduleId: ModuleId): void {
  const globals = getGlobals()
  assert(!(moduleId in globals), moduleId)
  globals[moduleId] = true
}

function getGlobals() {
  globalThis._vike ??= {}
  globalThis._vike.globals ??= {}
  return globalThis._vike.globals
}
declare global {
  var _vike: VikeGlobalInternal
}
