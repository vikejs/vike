export { readableStream }

import { markers } from '../../../../shared-server-client/streamedValues.js'
import { chunkToLine } from './lines.js'
import type { StreamedValueType } from './registry.js'
import '../../../assertEnvServer.js'

const readableStream: StreamedValueType<ReadableStream<unknown>, ReadableStreamReadResult<unknown>> = {
  marker: markers.readableStream,
  is: (value) => value instanceof ReadableStream,
  read(value) {
    const reader = value.getReader()
    return { next: () => reader.read(), toLine: chunkToLine, cancel: () => reader.cancel() }
  },
}
