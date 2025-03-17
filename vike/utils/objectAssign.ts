export { objectAssign }

import { assert } from './assert.js'

// Same as Object.assign() but:
//  - With type inference
//  - Preserves property descriptors, which we need for preserving the getters added by getPageContextUrlComputed()
function objectAssign<Obj extends object, ObjAddendum extends object | null>(
  obj: Obj,
  objAddendum: ObjAddendum,
  objAddendumCanBePageContextObject?: true
): asserts obj is Obj & ObjAddendum {
  if (objAddendum) {
    if (!objAddendumCanBePageContextObject) {
      // We only need this assert() in the rare case when the user is expected to mutate `pageContext` after the Vike hook was executed (and its promise resolved).
      // - The only use case I can think of is the user mutating `pageContext` after the onRenderClient() promise resolved (which can happen when client-side rendering finishes after onRenderClient() resolves). In that case, having Vike await async Vike hooks isn't enough.
      // - IIRC this assert() was mostly needed for preserving the getters added by getPageContextUrlComputed() but we don't need this anymore.
      assert(!('_isPageContextObject' in objAddendum))
    }
    Object.defineProperties(obj, Object.getOwnPropertyDescriptors(objAddendum))
  }
}
