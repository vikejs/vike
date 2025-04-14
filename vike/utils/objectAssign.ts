export { objectAssign }

import { assert } from './assert.js'

// Same as Object.assign() but:
//  - With type inference
//  - Preserves property descriptors, which we need for preserving the getters of getPageContextUrlComputed()
function objectAssign<Obj extends object, ObjAddendum extends object | null>(
  obj: Obj,
  objAddendum: ObjAddendum,
  objAddendumCanBePageContextObject?: true
): asserts obj is Obj & ObjAddendum {
  if (objAddendum) {
    if (!objAddendumCanBePageContextObject) assert(!('_isPageContextObject' in objAddendum))
    Object.defineProperties(obj, Object.getOwnPropertyDescriptors(objAddendum))
  }
}
