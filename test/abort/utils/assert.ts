export function assert(condition: unknown, debugInfo?: unknown): asserts condition {
  if (condition) return
  let errMsg = 'Assertion failure.'
  if (debugInfo) errMsg += ' ' + JSON.stringify({ debugInfo })
  throw new Error(errMsg)
}
