// Same as Object.defineProperty() but with type inference
export function objectDefineProperty<Obj extends object, Prop extends PropertyKey, PropertyType>(
  obj: Obj,
  prop: Prop,
  { get, ...args }: { get: () => PropertyType } & Omit<PropertyDescriptor, 'set' | 'get'>,
): asserts obj is Obj & Record<Prop, PropertyType> {
  Object.defineProperty(obj, prop, { ...args, get })
}
