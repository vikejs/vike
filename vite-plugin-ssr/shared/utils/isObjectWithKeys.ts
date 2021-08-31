import { isPlainObject } from './isPlainObject'

export { isObjectWithKeys }

function isObjectWithKeys<Keys extends readonly string[]>(
  obj: unknown,
  keys: Keys
): obj is { [key in Keys[number]]: unknown } {
  if (!isPlainObject(obj)) {
    return false
  }
  const objKeys = Object.keys(obj)
  for (const key of objKeys) {
    if (!keys.includes(key)) {
      return false
    }
  }
  for (const key of keys) {
    if (!objKeys.includes(key)) {
      return false
    }
  }
  return true
}
