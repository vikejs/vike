export { shallowClone }

import { assertIsNotBrowser } from './assertIsNotBrowser.js'
import { isObject } from './isObject.js'
assertIsNotBrowser()

// - AFAICT it's the most accurate.
// - The structuredClone() built-in isn't usable: https://www.typescriptlang.org/play/?ssl=7&ssc=1&pln=9&pc=1#code/G4QwTgBApmkLwQHZQO4QKKwPZgBQHIBhAVwGcAXLAW2mzHwEoIRTnEBPAKAh95jAB0AYywATKBAT50AfUIBVAMoAVAPIBZfN149+AiiHJlCYiQgCsABkucRiCrTCEANlmSjJECmGJCjYKFEXNyhcfgZOAHpIiAAZLABzVgADYkRxADMAS3dk2zdSLGcoAVcEgn5g92FTfAAaRyrAmvEIqJjlAAswLBRWEERHHE5vX39AptwAby9qKAAxNKFcJimAXzWGIA
function shallowClone<Obj>(obj: Obj): Obj {
  if (!isObject(obj)) return obj
  const clone = Object.create(Object.getPrototypeOf(obj))
  Object.defineProperties(clone, Object.getOwnPropertyDescriptors(obj))
  // The clone can't call the getters that need the original's internals (e.g. a DOMException's `message`) => it gets their values instead
  const keysSeen = new Set<PropertyKey>()
  for (let source: object | null = obj; source && source !== Object.prototype; source = Object.getPrototypeOf(source)) {
    for (const key of Reflect.ownKeys(source)) {
      if (keysSeen.has(key)) continue
      keysSeen.add(key)
      if (!Object.getOwnPropertyDescriptor(source, key)!.get) continue
      try {
        Object.defineProperty(clone, key, { value: Reflect.get(obj, key), writable: true, configurable: true })
      } catch {
        // The getter throws, or the property can't be redefined => the clone keeps it as is
      }
    }
  }
  return clone
}
