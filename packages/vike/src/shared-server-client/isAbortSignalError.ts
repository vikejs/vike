export { isAbortSignalError }

import { isObject } from '../utils/isObject.js'

// Whether the error is caused by pageContext.abortSignal, e.g. `fetch(url, { signal: pageContext.abortSignal })` throws an error upon pageContext.abortSignal.abort()
function isAbortSignalError(err: unknown, abortSignal: AbortSignal | undefined): boolean {
  if (!abortSignal?.aborted) return false
  return (
    // The reason isn't always an AbortError, e.g. srvx aborts with Node's `Error: aborted` (ECONNRESET)
    err === abortSignal.reason ||
    // Chromium rejects a response body read with another AbortError
    (isObject(err) && err.name === 'AbortError')
  )
}
