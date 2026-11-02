export { promise }
export { catchStreamedPromises }

import { markers } from '../../../../shared-server-client/streamedValues.js'
import { isPromise } from '../../../../utils/isPromise.js'
import { isPlainObject } from '../../../../utils/isPlainObject.js'
import type { StreamedValueType } from './registry.js'
import '../../../assertEnvServer.js'

// One `v` line
const promise: StreamedValueType<Promise<unknown>> = {
  marker: markers.promise,
  is: isPromise,
  read: (value) => ({
    next: () => value,
    toLine: (v) => ({ line: { v }, isLast: true }),
    cancel: () => {},
  }),
}

// A promise is read only once pageContext is serialized (e.g. after the HTML is rendered)
// - Otherwise a promise that rejects before is an unhandled rejection
function catchStreamedPromises(value: unknown): void {
  if (isPromise(value)) Promise.resolve(value).catch(() => {})
  else if (Array.isArray(value)) value.forEach(catchStreamedPromises)
  else if (isPlainObject(value)) Object.values(value).forEach(catchStreamedPromises)
}
