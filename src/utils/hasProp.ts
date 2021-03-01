export { hasProp }

function hasProp<K extends PropertyKey>(
  obj: object,
  prop: K
): obj is Record<K, unknown> {
  return prop in obj
}
