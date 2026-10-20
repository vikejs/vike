export { isAbortSignalError }

import { isObject } from '../utils/isObject.js'

// Whether the error is caused by pageContext.abortSignal, e.g. a hook's `fetch(url, { signal: pageContext.abortSignal })`
// - Not `err === abortSignal.reason`: Chromium rejects a response body read with another AbortError
function isAbortSignalError(err: unknown, abortSignal: AbortSignal | undefined): boolean {
  return !!abortSignal?.aborted && isObject(err) && err.name === 'AbortError'
}
