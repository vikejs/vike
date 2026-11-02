export { promise }

import { markers } from '../../../../shared-server-client/streamedValues.js'
import { isPromise } from '../../../../utils/isPromise.js'
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
