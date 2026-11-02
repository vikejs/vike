export { catchStreamedPromises }

import { logRuntimeError, type PageContext_logRuntime } from '../../loggerRuntime.js'
import { isPlainObject } from '../../../../utils/isPlainObject.js'
import '../../../assertEnvServer.js'

// A promise is read only after pageContext is serialized (e.g. after the HTML is rendered), or never (e.g. upon
// `throw redirect()`): its error is logged as soon as it rejects.
// - Otherwise a promise that rejects before is an unhandled rejection
// - Only native promises: a thenable (e.g. a query builder) runs only once it's read
function catchStreamedPromises(value: unknown, pageContext: NonNullable<PageContext_logRuntime>): void {
  if (value instanceof Promise) {
    value.catch((err) => logRuntimeError(err, pageContext))
  } else if (Array.isArray(value)) {
    value.forEach((v) => catchStreamedPromises(v, pageContext))
  } else if (isPlainObject(value)) {
    Object.values(value).forEach((v) => catchStreamedPromises(v, pageContext))
  }
}
