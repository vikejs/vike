export { isPlainObject }

type PlainObject = Record<string, unknown>

function isPlainObject(value: unknown): value is PlainObject {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  // Support `Object.create(null)`
  if (Object.getPrototypeOf(value) === null) {
    return true
  }
  return (
    /* Doesn't work in Cloudlfare Pages workers
    value.constructor === Object
    */
    value.constructor.name === 'Object'
  )
}
