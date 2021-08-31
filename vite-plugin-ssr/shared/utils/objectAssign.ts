export { objectAssign }

function objectAssign<Obj extends Record<string, unknown>, ObjAddendum extends Record<string, unknown>>(
  obj: Obj,
  objAddendum: ObjAddendum
): asserts obj is Obj & ObjAddendum {
  Object.assign(obj, objAddendum)
}
