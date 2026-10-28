export { logErrorClient }

import { isObject } from '../../utils/isObject.js'
import { isAbortSignalError } from '../../shared-server-client/isAbortSignalError.js'
import '../assertEnvClient.js'

function logErrorClient(err: unknown, abortSignal: AbortSignal) {
  if (isAbortSignalError(err, abortSignal)) {
    // Skip errors caused by `pageContext.abortSignal.abort()`
    // - E.g. the user navigates to another page
    // - Upon `pageContext.abortSignal.abort() => an error can be thrown, e.g. by `fetch(url, { signal })`
    // - https://vike.dev/pageContext#abortSignal
    return
  }
  if (
    isObject(err) &&
    // Set by vike-react
    // https://github.com/vikejs/vike-react/blob/195a208c6b77e7f34496e1f637278a36c60fbe07/packages/vike-react/src/integration/onRenderClient.tsx#L109
    err.isAlreadyLogged
  ) {
    return
  }
  console.error(err)
}
