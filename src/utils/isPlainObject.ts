export { isPlainObject }

//type PlainObject = Object
//type PlainObject = Record<string, any>
type PlainObject = Record<string, unknown>

function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === 'object' && value !== null && value.constructor === Object
}
