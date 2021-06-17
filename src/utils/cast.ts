export { cast }
export { castProp }

function cast<T>(thing: unknown): asserts thing is T {}

function castProp<PropType, ObjectType, PropName extends PropertyKey>(
  obj: ObjectType,
  prop: PropName
): asserts obj is ObjectType & Record<PropName, PropType> {}
