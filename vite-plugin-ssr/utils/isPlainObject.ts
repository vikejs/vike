export { isPlainObject }

type PlainObject = Record<string, unknown>

function isPlainObject(value: unknown): value is PlainObject {
  return (
    typeof value === 'object' &&
    value !== null &&
    /* Doesn't work in Cloudlfare Pages workers
    value.constructor.name === Object
    */
    value.constructor.name === 'Object'
  )
}
