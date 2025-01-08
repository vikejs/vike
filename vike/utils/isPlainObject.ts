export function isPlainObject(value: unknown): value is Record<string, unknown> {
  // Is object?
  if (typeof value !== 'object' || value === null) {
    return false
  }

  // Support `Object.create(null)`
  if (Object.getPrototypeOf(value) === null) {
    return true
  }

  // Is plain object?
  return (
    /* Doesn't work in Cloudflare Pages workers
    value.constructor === Object
    */
    value.constructor.name === 'Object'
  )
}
