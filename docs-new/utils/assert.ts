export { assert }

function assert(condition: unknown, debugInfo?: unknown): asserts condition {
  if (condition) {
    return
  }
  if (debugInfo !== undefined) {
    console.log(debugInfo)
  }
  throw new Error('Assertion Failed')
}
