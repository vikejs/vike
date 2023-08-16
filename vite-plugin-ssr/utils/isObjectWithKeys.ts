import { isPlainObject } from './isPlainObject.js'

export { isObjectWithKeys }

function isObjectWithKeys<Keys extends readonly string[]>(
  obj: unknown,
  keys: Keys
): obj is { [key in Keys[number]]?: unknown } {
  if (!isPlainObject(obj)) {
    return false
  }
  for (const key of Object.keys(obj)) {
    if (!keys.includes(key)) {
      return false
    }
  }
  return true
}
