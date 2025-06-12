// Zero-config support for https://www.npmjs.com/package/react-streaming

export { isStreamFromReactStreamingPackage }
export { streamFromReactStreamingPackageToString }
export { getStreamOfReactStreamingPackage }
export type { StreamFromReactStreamingPackage }
export type { StreamFromReactStreamingPackagePublic }

import type { renderToStream } from 'react-streaming/server'
import { assert, assertUsage, hasProp, isVikeReactApp } from '../../utils.js'
import { streamPipeNodeToString, StreamReadableWeb, streamReadableWebToString, StreamWritableNode } from '../stream.js'

// We use this simplistic public type to avoid type mismatches (when the user installed another version than Vike's devDependency#react-streaming install).
type StreamFromReactStreamingPackagePublic = { injectToStream: Function }
type StreamFromReactStreamingPackage = Awaited<ReturnType<typeof renderToStream>>

function streamFromReactStreamingPackageToString(stream: StreamFromReactStreamingPackage) {
  if (stream.pipe) {
    return streamPipeNodeToString(stream.pipe)
  }
  if (stream.readable) {
    return streamReadableWebToString(stream.readable)
  }
  assert(false)
}

function isStreamFromReactStreamingPackage(thing: unknown): thing is StreamFromReactStreamingPackage {
  if (hasProp(thing, 'injectToStream', 'function')) {
    assertUsage(
      hasProp(thing, 'hasStreamEnded', 'function'),
      isVikeReactApp()
        ? //
          'Update vike-react to its latest version'
        : 'Update react-streaming to its latest version',
    )
    return true
  }
  return false
}

type Pipe = { __streamPipeNode: (writable: StreamWritableNode) => void }
type Readable = StreamReadableWeb
function getStreamOfReactStreamingPackage(stream: StreamFromReactStreamingPackage): Pipe | Readable {
  if (stream.pipe) {
    return { __streamPipeNode: stream.pipe }
  }
  if (stream.readable) {
    return stream.readable
  }
  assert(false)
}
