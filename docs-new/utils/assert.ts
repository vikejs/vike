export { assert }

function assert(condition: unknown, debugInfo?: unknown): asserts condition {
  if (condition) {
    return
  }
  if (debugInfo !== undefined) {
    if( typeof debugInfo === 'object' ) {
      debugInfo = JSON.stringify(debugInfo)
    }
    console.log(debugInfo)
  }
  throw new Error('Assertion Failed')
}
