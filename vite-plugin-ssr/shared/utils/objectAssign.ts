export { objectAssign }

// Same as `Object.assign()` but with type inference
function objectAssign<Obj extends Record<string, unknown>, ObjAddendum extends Record<string, unknown>>(
  obj: Obj,
  objAddendum: ObjAddendum
): asserts obj is Obj & ObjAddendum {
  Object.assign(obj, objAddendum)
}
