export { cast }
export { castProp }

function cast<T>(_thing: unknown): asserts _thing is T {}

function castProp<PropType, ObjectType, PropName extends PropertyKey>(
  _obj: ObjectType,
  _prop: PropName,
): asserts _obj is ObjectType & Record<PropName, PropType> {}
