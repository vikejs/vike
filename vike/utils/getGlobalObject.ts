export { getGlobalObject }
export { assertIsSingleModuleInstance }

import { assert } from './assert.js'

// We use the file name and file directory as key: there should be only one getGlobalObject() usage per file.
type Key = `${string}/${string}.ts`

/** Share information across module instances. */
function getGlobalObject<T extends Record<string, unknown> = never>(key: Key, defaultValue: T): T {
  const globalObjects = getGlobalObjects()
  const globalObject = (globalObjects[key] = globalObjects[key] || defaultValue)
  return globalObject
}

/** Assert that the module is instantiated only once. */
function assertIsSingleModuleInstance(key: Key): void {
  const globalObjects = getGlobalObjects()
  assert(!(key in globalObjects))
}

function getGlobalObjects() {
  const projectKey = '_vike'
  // @ts-ignore
  const globalObjects: any = (globalThis[projectKey] = globalThis[projectKey] || {})
  return globalObjects
}
