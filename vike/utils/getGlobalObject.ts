export { getGlobalObject }
export { assertIsSingleModuleInstance }

import { assert } from './assert.js'

/** Share information across module instances. */
function getGlobalObject<T extends Record<string, unknown> = never>(
  // We use the filename (or file path) as key. There should be only one getGlobalObject() usage per file. Thus the key should be unique, assuming the filename (or file path) is unique.
  key: `${string}.ts`,
  defaultValue: T
): T {
  const globalObjects = getGlobalObjects()
  const globalObject = (globalObjects[key] = globalObjects[key] || defaultValue)
  return globalObject
}

/** Assert that the module is instantiated only once. */
function assertIsSingleModuleInstance(
  // We use the filename (or file path) as key.
  key: `${string}.ts`
): void {
  const globalObjects = getGlobalObjects()
  assert(!(key in globalObjects))
}

function getGlobalObjects() {
  const projectKey = '_vike'
  // @ts-ignore
  const globalObjects: any = (globalThis[projectKey] = globalThis[projectKey] || {})
  return globalObjects
}
