// Zero-config support for https://www.npmjs.com/package/react-streaming

export { isStreamReactStreaming }
export { streamReactStreamingToString }
export { getStreamFromReactStreaming }
export type { StreamReactStreaming }
export type { InjectToStream }

import { assert, hasProp } from '../../utils.js'
import { streamPipeNodeToString, StreamReadableWeb, streamReadableWebToString, StreamWritableNode } from '../stream.js'

// Same type than:
// ```
// import type { InjectToStream } from 'react-streaming/server'
// ```
type InjectToStream = (
  chunk: unknown,
  options?: {
    flush?: boolean
  }
) => void

// ```js
// import { renderToStream } from 'react-streaming/server'
// const { pipe, readable, injectToStream } = await renderToStream()`
// ```
type StreamReactStreaming =
  | {
      injectToStream: InjectToStream
      // Older `react-streaming` versions don't define `disabled`
      disabled?: boolean
    } & (
      | {
          pipe: (writable: StreamWritableNode) => void
          readable: null
        }
      | {
          pipe: null
          readable: StreamReadableWeb
        }
    )
function streamReactStreamingToString(stream: StreamReactStreaming) {
  if (stream.pipe) {
    return streamPipeNodeToString(stream.pipe)
  }
  if (stream.readable) {
    return streamReadableWebToString(stream.readable)
  }
  assert(false)
}

function isStreamReactStreaming(thing: unknown): thing is StreamReactStreaming {
  if (hasProp(thing, 'injectToStream', 'function')) {
    return true
  }
  // TODO
  //if( isStreamPipeNode
  return false
}

function getStreamFromReactStreaming(stream: StreamReactStreaming) {
  if (stream.pipe) {
    // TODO
    return { __streamPipeNode: stream.pipe }
  }
  if (stream.readable) {
    return stream.readable
  }
  assert(false)
}
