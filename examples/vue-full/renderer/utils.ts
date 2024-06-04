// Same as Object.assign() but with type inference
export function objectAssign<Obj extends object, ObjAddendum>(
  obj: Obj,
  objAddendum: ObjAddendum
): asserts obj is Obj & ObjAddendum {
  Object.assign(obj, objAddendum)
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
