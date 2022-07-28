export { objectAssign }

// Same as `Object.assign()` but with type inference
function objectAssign<Obj extends object, ObjAddendum, T extends any[]>(
  obj: Obj,
  ...objAddendum: [ObjAddendum, ...T]
): asserts obj is Obj & ObjAddendum & ([] extends T ? {} : T[number]) {
  Object.assign(obj, ...objAddendum)
}
