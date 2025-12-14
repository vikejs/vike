export { shallowClone }

import { isObject } from './isObject.js'

// - AFAICT it's the most accurate.
// - The structuredClone() built-in isn't usable: https://www.typescriptlang.org/play/?ssl=7&ssc=1&pln=9&pc=1#code/G4QwTgBApmkLwQHZQO4QKKwPZgBQHIBhAVwGcAXLAW2mzHwEoIRTnEBPAKAh95jAB0AYywATKBAT50AfUIBVAMoAVAPIBZfN149+AiiHJlCYiQgCsABkucRiCrTCEANlmSjJECmGJCjYKFEXNyhcfgZOAHpIiAAZLABzVgADYkRxADMAS3dk2zdSLGcoAVcEgn5g92FTfAAaRyrAmvEIqJjlAAswLBRWEERHHE5vX39AptwAby9qKAAxNKFcJimAXzWGIA
function shallowClone<Obj>(obj: Obj): Obj {
  if (!isObject(obj)) return obj
  const clone = Object.create(Object.getPrototypeOf(obj))
  Object.defineProperties(clone, Object.getOwnPropertyDescriptors(obj))
  return clone
}
