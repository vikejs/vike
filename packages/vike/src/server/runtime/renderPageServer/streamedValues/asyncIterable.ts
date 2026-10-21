export { asyncIterable }

import { markers } from '../../../../shared-server-client/streamedValues.js'
import { chunkToLine } from './lines.js'
import type { StreamedValueType } from './registry.js'
import '../../../assertEnvServer.js'

const asyncIterable: StreamedValueType<AsyncIterable<unknown>, IteratorResult<unknown>> = {
  marker: markers.asyncIterable,
  is: (value): value is AsyncIterable<unknown> =>
    typeof value === 'object' && value !== null && Symbol.asyncIterator in value,
  read(value) {
    const iterator = value[Symbol.asyncIterator]()
    return { next: () => iterator.next(), toLine: chunkToLine, cancel: () => iterator.return?.() }
  },
}
