// Same as `Object.assign(obj, objNewVals)` but ensure that `objNewVals` properties alreay exist on `obj`
export function objectAssignSafe<Obj extends Record<string, unknown>, ObjNewVals extends Partial<Obj>>(
  obj: Obj,
  objNewVals: ObjNewVals,
) {
  Object.assign(obj, objNewVals)
}
