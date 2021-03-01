export { hasProp }

function hasProp<K extends PropertyKey>(
  obj: unknown,
  prop: K
): obj is Record<K, unknown> {
  return typeof obj === 'object' && obj !== null && prop in obj
}
