// Zero-config support for https://www.npmjs.com/package/react-streaming

export { isStreamReactStreaming }
export { streamReactStreamingToString }
export { getStreamFromReactStreaming }
export type { StreamReactStreaming }
export type { StreamReactStreamingPublic }

import type { renderToStream } from 'react-streaming/server'
import { assert, assertUsage, hasProp, isVikeReactApp } from '../../utils.js'
import { streamPipeNodeToString, StreamReadableWeb, streamReadableWebToString, StreamWritableNode } from '../stream.js'

// We use this simplistic public type to avoid type mismatches (when the user installed another version than Vike's devDependency#react-streaming install).
type StreamReactStreamingPublic = { injectToStream: Function }
type StreamReactStreaming = Awaited<ReturnType<typeof renderToStream>>

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
    assertUsage(
      hasProp(thing, 'hasStreamEnded', 'function'),
      isVikeReactApp()
        ? //
          'Update vike-react to its latest version'
        : 'Update react-streaming to its latest version'
    )
    return true
  }
  return false
}

type Pipe = { __streamPipeNode: (writable: StreamWritableNode) => void }
type Readable = StreamReadableWeb
function getStreamFromReactStreaming(stream: StreamReactStreaming): Pipe | Readable {
  if (stream.pipe) {
    return { __streamPipeNode: stream.pipe }
  }
  if (stream.readable) {
    return stream.readable
  }
  assert(false)
}
