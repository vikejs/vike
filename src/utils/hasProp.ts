export { hasProp }

function hasProp<PropValueType = unknown, PropKeyType extends PropertyKey = never, ObjectType = unknown>(
  obj: ObjectType,
  prop: PropKeyType
): obj is ObjectType & Record<PropKeyType, PropValueType> {
  return typeof obj === 'object' && obj !== null && prop in obj
}
