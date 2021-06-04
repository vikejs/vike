export { assert }

function assert(condition: unknown): asserts condition {
  if (condition) {
    return
  }
  throw new Error('Assertion Failed')
}
