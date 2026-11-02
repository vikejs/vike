export { catchStreamedPromises }

import { logRuntimeError, type PageContext_logRuntime } from '../../loggerRuntime.js'
import '../../../assertEnvServer.js'

// A promise is read only after pageContext is serialized (e.g. after the HTML is rendered), or never (e.g. upon
// `throw redirect()`): its error is logged as soon as it rejects.
// - Otherwise a promise that rejects before is an unhandled rejection
// - Only native promises: a thenable (e.g. a query builder) runs only once it's read
// - Each object is walked once: the value can be cyclic (e.g. with `toJSON()`)
function catchStreamedPromises(value: unknown, pageContext: NonNullable<PageContext_logRuntime>): void {
  const walked = new WeakSet<object>()
  const walk = (value: unknown): void => {
    if (typeof value !== 'object' || value === null || walked.has(value)) return
    walked.add(value)
    if (value instanceof Promise) value.then(walk, (err) => logRuntimeError(err, pageContext))
    else if (Array.isArray(value) || value instanceof Map || value instanceof Set) value.forEach(walk)
    else if (
      // Not every byte of a typed array or Buffer
      !ArrayBuffer.isView(value)
    ) {
      // Without calling getters: a getter can throw
      Object.values(Object.getOwnPropertyDescriptors(value)).forEach((descriptor) => walk(descriptor.value))
    }
  }
  walk(value)
}
