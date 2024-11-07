export { objectAssign }

import { assert } from './assert'

// Same as Object.assign() but:
//  - With type inference
//  - Preserves property descriptors, which we need for preserving the getters added by getPageContextUrlComputed()
function objectAssign<Obj extends object, ObjAddendum extends object | null>(
  obj: Obj,
  objAddendum: ObjAddendum
): asserts obj is Obj & ObjAddendum {
  if (objAddendum) {
    assert(!('_isPageContextObject' in objAddendum))
    Object.defineProperties(obj, Object.getOwnPropertyDescriptors(objAddendum))
  }
}
