import { assertUsage, assertWarning } from './assert'

export { objectAssign }

// Same as `Object.assign()` but with type inference
function objectAssign<Obj extends Record<string, unknown>, ObjAddendum extends Record<string, unknown>>(
  obj: Obj,
  objAddendum: ObjAddendum
): asserts obj is Obj & ObjAddendum {
  const keysAddendum = Object.keys(objAddendum)
  const keysExisting = Object.keys(obj)
  const keysOverriden = intersection(keysExisting, keysAddendum)
  //assertWarning(keysOverriden.length===0, `Overriding keys: ${JSON.stringify(keysOverriden)}`)
  assertUsage(keysOverriden.length === 0, `Overriding keys: ${JSON.stringify(keysOverriden)}`)
  assertWarning // make TS happy
  Object.assign(obj, objAddendum)
}

function intersection(array1: string[], array2: string[]) {
  const filteredArray = array1.filter((value) => array2.includes(value))
  return filteredArray
}
