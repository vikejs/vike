export { isAbortSignalError }

import { isObject } from '../utils/isObject.js'

// Whether the error is caused by `pageContext.abortSignal.abort()`
// - E.g. `fetch(url, { signal: pageContext.abortSignal })` throws an error upon `pageContext.abortSignal.abort()`
function isAbortSignalError(err: unknown, abortSignal: AbortSignal | undefined): boolean {
  if (!abortSignal?.aborted) return false
  return (
    // The error is usually the signal's reason, e.g. `fetch(url, { signal })` rejects with `signal.reason`
    // - The reason isn't always an AbortError: for example, when the client disconnects, srvx aborts the signal with Node's `Error: aborted`
    err === abortSignal.reason ||
    // Or it's a new AbortError: for example, in Chromium, reading the body of a `fetch(url, { signal })` response rejects with a new AbortError (not `signal.reason`)
    (isObject(err) && err.name === 'AbortError')
  )
}
