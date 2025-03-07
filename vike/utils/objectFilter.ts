// Type inference for:
// ```js
// Object.fromEntries(Object.entries(obj).filter(someFilter))
// ```
export function objectFilter<Val, Val2 extends Val, Obj extends Record<string, Val>>(
  obj: Obj,
  filter: (arg: [string, Val]) => arg is [string, Val2]
): Record<string, Val2> {
  return Object.fromEntries(Object.entries(obj).filter(filter))
}
