export { objectAssign }

import { assert } from './assert.js'

// Same as Object.assign() but:
//  - With type inference
//  - Preserves property descriptors, which we need for preserving the getters added by addUrlComputedProps()
function objectAssign<Obj extends object, ObjAddendum extends object | null>(
  obj: Obj,
  objAddendum: ObjAddendum
): asserts obj is Obj & ObjAddendum {
  if (objAddendum) {
    // pageContext.urlOriginal should never be modified
    assert(!('urlOriginal' in objAddendum))
    Object.defineProperties(obj, Object.getOwnPropertyDescriptors(objAddendum))
  }
}
