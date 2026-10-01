export { readableStream }

import { markers } from '../../../shared-server-client/streamedValues.js'
import { decodeChunk, getLineError } from './lines.js'
import type { StreamedValueType } from './registry.js'
import '../../assertEnvClient.js'

// Fed by its chunk lines, until its `end` or `error` line
const readableStream: StreamedValueType = {
  marker: markers.readableStream,
  revive(parseValue) {
    let controller!: ReadableStreamDefaultController<unknown>
    let isClosed = false
    const value = new ReadableStream<unknown>({
      start(controller_) {
        controller = controller_
      },
      cancel() {
        // Released by its consumer: the rest is ignored
        isClosed = true
      },
    })
    const close = (err?: unknown) => {
      if (isClosed) return
      isClosed = true
      if (err) controller.error(err)
      else controller.close()
    }
    return {
      value,
      push(line) {
        if (isClosed) return
        if ('end' in line) close()
        else if ('error' in line) close(getLineError())
        else controller.enqueue(decodeChunk(line, parseValue))
      },
      fail: close,
    }
  },
}
