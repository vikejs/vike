// Zero-config support for https://www.npmjs.com/package/react-streaming

export type { StreamReactStreaming }
export { isStreamReactStreaming }
export { streamReactStreamingToString }
export { getStreamFromReactStreaming }

import { assert, hasProp } from '../../utils'
import { streamPipeNodeToString, StreamReadableWeb, streamReadableWebToString, StreamWritableNode } from '../stream'

// ```js
// import { renderToStream } from 'react-streaming/server'
// const { pipe, readable, injectToStream } = await renderToStream()`
// ```
type StreamReactStreaming =
  | { injectToStream: (chunk: string) => void } & (
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
