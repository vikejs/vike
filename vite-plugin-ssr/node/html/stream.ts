export { getStreamReadableNode }
export { getStreamReadableWeb }
export { pipeToStreamWritableNode }
export { pipeToStreamWritableWeb }
export { processStream }
export { isStream }
export { streamToString }
export { getStreamName }
export { inferStreamName }

export { streamReadableWebToString }
export { streamPipeNodeToString }
export { isStreamWritableWeb }
export { isStreamWritableNode }

export type { Stream }
export type { StreamTypePatch }
export type { StreamReadableWeb }
export type { StreamReadableNode }
export type { StreamWritableWeb }
export type { StreamWritableNode }
export type { StreamPipeWeb }
export type { StreamPipeNode }

// Public: consumed by vite-plugin-ssr users
export { stampPipe }
export { pipeStream }
export { pipeWebStream }
export { pipeNodeStream }

import {
  assert,
  assertUsage,
  checkType,
  isObject,
  hasProp,
  objectAssign,
  capitalizeFirstLetter,
  assertWarning,
  isCallable,
  createDebugger
} from '../utils'
import { HtmlRender } from './renderHtml'
// In order to support Cloudflare Workers, we cannot statically import the `stream` module.
// Instead we only import the types and dynamically import `stream` in `loadStreamNodeModule()`.
import type { Readable as StreamReadableNode, Writable as StreamWritableNode } from 'stream'
import {
  getStreamFromReactStreaming,
  isStreamReactStreaming,
  StreamReactStreaming,
  streamReactStreamingToString
} from './stream/react-streaming'
//import { streamNodeModuleGet as loadStreamNodeModule } from './stream/streamNodeModule'

const debug = createDebugger('vps:stream')

type StreamReadableWeb = ReadableStream
type StreamWritableWeb = WritableStream
//type StreamReadableNode = typeof import('stream').Readable
//type StreamWritableNode = typeof import('stream').Writable
type StreamPipeWeb = (writable: StreamWritableWeb) => void
type StreamPipeNode = (writable: StreamWritableNode) => void
type StreamPipe = (writable: StreamWritableNode | StreamWritableWeb) => void
type Stream =
  | StreamReadableWeb
  | StreamReadableNode
  | StreamPipeWebWrapped // pipeWebStream()
  | StreamPipeWeb // stampPipe()
  | StreamPipeNodeWrapped // pipeNodeStream()
  | StreamPipeNode // stampPipe()
  | StreamReactStreaming
// `ReactDOMServer.renderToNodeStream()` returns a `NodeJS.ReadableStream` which differs from `Stream.Readable`
type StreamTypePatch = NodeJS.ReadableStream

function isStreamReadableWeb(thing: unknown): thing is StreamReadableWeb {
  return typeof ReadableStream !== 'undefined' && thing instanceof ReadableStream
}
function isStreamWritableWeb(thing: unknown): thing is StreamWritableWeb {
  return typeof WritableStream !== 'undefined' && thing instanceof WritableStream
}
function isStreamReadableNode(thing: unknown): thing is StreamReadableNode {
  if (isStreamReadableWeb(thing)) {
    return false
  }
  // https://stackoverflow.com/questions/17009975/how-to-test-if-an-object-is-a-stream-in-nodejs/37022523#37022523
  return hasProp(thing, 'read', 'function')
}
function isStreamWritableNode(thing: unknown): thing is StreamWritableNode {
  if (isStreamWritableWeb(thing)) {
    return false
  }
  // https://stackoverflow.com/questions/17009975/how-to-test-if-an-object-is-a-stream-in-nodejs/37022523#37022523
  return hasProp(thing, 'write', 'function')
}

async function streamReadableNodeToString(readableNode: StreamReadableNode): Promise<string> {
  // Copied from: https://stackoverflow.com/questions/10623798/how-do-i-read-the-contents-of-a-node-js-stream-into-a-string-variable/49428486#49428486
  const chunks: Buffer[] = []
  return new Promise((resolve, reject) => {
    readableNode.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
    readableNode.on('error', (err) => reject(err))
    readableNode.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
  })
}

async function streamReadableWebToString(readableWeb: ReadableStream): Promise<string> {
  let str: string = ''
  const reader = readableWeb.getReader()
  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }
    str += value
  }
  return str
}
async function stringToStreamReadableNode(str: string): Promise<StreamReadableNode> {
  const { Readable } = await loadStreamNodeModule()
  return Readable.from(str)
}
function stringToStreamReadableWeb(str: string): StreamReadableWeb {
  // `ReadableStream.from()` spec discussion: https://github.com/whatwg/streams/issues/1018
  assertReadableStreamConstructor()
  const readableStream = new ReadableStream({
    start(controller) {
      controller.enqueue(encodeForWebStream(str))
      controller.close()
    }
  })
  return readableStream
}
function stringToStreamPipeNode(str: string): StreamPipeNode {
  return (writable: StreamWritableNode) => {
    writable.write(str)
    writable.end()
  }
}
function stringToStreamPipeWeb(str: string): StreamPipeWeb {
  return (writable: StreamWritableWeb) => {
    const writer = writable.getWriter()
    writer.write(encodeForWebStream(str))
    writer.close()
  }
}

async function streamPipeNodeToString(streamPipeNode: StreamPipeNode): Promise<string> {
  let str: string = ''
  let resolve: () => void
  let reject: (err: unknown) => void
  const promise = new Promise<string>((resolve_, reject_) => {
    resolve = () => resolve_(str)
    reject = reject_
  })
  const { Writable } = await loadStreamNodeModule()
  const writable = new Writable({
    write(chunk, _encoding, callback) {
      const s = chunk.toString()
      assert(typeof s === 'string')
      str += s
      callback()
    },
    final(callback) {
      resolve()
      callback()
    },
    destroy(err) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    }
  })
  streamPipeNode(writable)
  return promise
}
function streamPipeWebToString(streamPipeWeb: StreamPipeWeb): Promise<string> {
  let str: string = ''
  let resolve: (s: string) => void
  const promise = new Promise<string>((r) => (resolve = r))
  const writable = new WritableStream({
    write(chunk) {
      assert(typeof chunk === 'string')
      str += chunk
    },
    close() {
      resolve(str)
    }
  })
  streamPipeWeb(writable)
  return promise
}

async function getStreamReadableNode(htmlRender: HtmlRender): Promise<null | StreamReadableNode> {
  if (typeof htmlRender === 'string') {
    return stringToStreamReadableNode(htmlRender)
  }
  if (isStreamReadableNode(htmlRender)) {
    return htmlRender
  }
  return null
}
function getStreamReadableWeb(htmlRender: HtmlRender): null | StreamReadableWeb {
  if (typeof htmlRender === 'string') {
    return stringToStreamReadableWeb(htmlRender)
  }
  if (isStreamReadableWeb(htmlRender)) {
    return htmlRender
  }
  return null
}

function pipeToStreamWritableWeb(htmlRender: HtmlRender, writable: StreamWritableWeb): boolean {
  if (typeof htmlRender === 'string') {
    const streamPipeWeb = stringToStreamPipeWeb(htmlRender)
    streamPipeWeb(writable)
    return true
  }
  if (isStreamReadableWeb(htmlRender)) {
    htmlRender.pipeTo(writable)
    return true
  }
  const streamPipeWeb = getStreamPipeWeb(htmlRender)
  if (streamPipeWeb) {
    streamPipeWeb(writable)
    return true
  }
  return false
}
function pipeToStreamWritableNode(htmlRender: HtmlRender, writable: StreamWritableNode): boolean {
  if (typeof htmlRender === 'string') {
    const streamPipeNode = stringToStreamPipeNode(htmlRender)
    streamPipeNode(writable)
    return true
  }
  if (isStreamReadableNode(htmlRender)) {
    htmlRender.pipe(writable)
    return true
  }
  const streamPipeNode = getStreamPipeNode(htmlRender)
  if (streamPipeNode) {
    streamPipeNode(writable)
    return true
  }
  return false
}

async function processStream<StreamType extends Stream>(
  streamOriginal: StreamType,
  {
    injectStringAtBegin,
    injectStringAtEnd,
    onErrorWhileStreaming,
    enableEagerStreaming
  }: {
    injectStringAtBegin?: () => Promise<string>
    injectStringAtEnd?: () => Promise<string>
    onErrorWhileStreaming: (err: unknown) => void
    enableEagerStreaming?: boolean
  }
): Promise<StreamType> {
  let resolve: (result: StreamType) => void
  let reject: (err: unknown) => void
  const streamWrapperPromise = new Promise<StreamType>((resolve_, reject_) => {
    resolve = (streamWrapper) => {
      promiseHasResolved = true
      resolve_(streamWrapper)
    }
    reject = (err) => {
      promiseHasResolved = true
      reject_(err)
    }
  })

  const buffer: unknown[] = []
  let shouldFlushStream = false
  let injectionBeginDone = false
  let streamOriginalHasStartedEmitting = false
  let isReadyToWrite = false
  let promiseHasResolved = false
  let wrapperCreated = false

  if (!injectStringAtBegin) {
    injectionBeginDone = true
  } else {
    const injectionBegin: string = await injectStringAtBegin()
    injectionBeginDone = true
    shouldFlushStream = true
    writeStream(injectionBegin)
  }

  const { streamWrapper, streamOperations } = await manipulateStream({
    streamOriginal,
    onReadyToWrite() {
      debug('stream begin')
      isReadyToWrite = true
      flushBuffer()
    },
    onError(err) {
      if (!promiseHasResolved) {
        reject(err)
      } else {
        onErrorWhileStreaming(err)
      }
    },
    onData(chunk: unknown) {
      streamOriginalHasStartedEmitting = true
      writeStream(chunk)
    },
    async onEnd() {
      if (injectStringAtEnd) {
        const injectEnd = await injectStringAtEnd()
        writeStream(injectEnd)
      }
      debug('stream end')
    },
    onFlush() {
      shouldFlushStream = true
      flushStream()
    }
  })
  wrapperCreated = true

  return streamWrapperPromise

  function writeStream(chunk: unknown) {
    buffer.push(chunk)

    if (isInitializing()) return

    flushBuffer()

    resolve(streamWrapper)
  }

  function flushBuffer() {
    if (isInitializing() || !isReadyToWrite) return
    buffer.forEach((chunk) => {
      streamOperations.writeChunk(chunk)
    })
    buffer.length = 0
    flushStream()
  }

  function flushStream() {
    if (isInitializing() || !isReadyToWrite) return
    if (!shouldFlushStream || streamOperations.flushStream === null) return
    streamOperations.flushStream()
    shouldFlushStream = false
    debug('stream flushed')
  }

  function isInitializing() {
    return !wrapperCreated || !injectionBeginDone || isDelayingStart()
  }

  // Delay streaming, so that if the page shell fails to render then show the error page.
  //  - This is what React expects.
  //  - Does this make sense for UI frameworks other than React?
  //  - We don't this anymore if we implement a client-side recover mechanism.
  //     - I.e. if we render the error page on the client-side if there is an error during the stream.
  //       - We cannot do this with Server Routing
  //     - Emitting the wrong status code doesn't matter with libraries like `react-streaming` which automatically disable streaming for bots. (Emitting the wrong status code doesn't matter for website users).
  function isDelayingStart() {
    return !streamOriginalHasStartedEmitting && !enableEagerStreaming
  }
}

async function manipulateStream<StreamType extends Stream>({
  streamOriginal,
  onError,
  onData,
  onEnd,
  onFlush,
  onReadyToWrite
}: {
  streamOriginal: StreamType
  onError: (err: unknown) => void
  onData: (chunk: unknown) => void
  onEnd: () => Promise<void>
  onFlush: () => void
  onReadyToWrite: () => void
}): Promise<{
  streamWrapper: StreamType
  streamOperations: { writeChunk: (chunk: unknown) => void; flushStream: null | (() => void) }
}> {
  if (isStreamReactStreaming(streamOriginal)) {
    debug('render() hook returned `react-streaming` result')
    const stream = getStreamFromReactStreaming(streamOriginal)
    ;(streamOriginal as Stream) = stream
  }

  if (isStreamPipeNode(streamOriginal)) {
    debug('render() hook returned Node.js Stream Pipe')

    let writableOriginal: null | (StreamWritableNode & { flush?: () => void }) = null
    const pipeProxy = (writable_: StreamWritableNode) => {
      writableOriginal = writable_
      debug('original Node.js Writable received')
      onReadyToWrite()
      if (hasEnded) {
        // `onReadyToWrite()` already wrote everything; we can close the stream right away
        writableOriginal.end()
      }
    }
    stampPipe(pipeProxy, 'node-stream')
    const writeChunk = (chunk: unknown) => {
      assert(writableOriginal)
      writableOriginal.write(chunk)
      if (debug.isEnabled) {
        debug('data written (Node.js Writable)', String(chunk))
      }
    }
    // For libraries such as https://www.npmjs.com/package/compression
    //  - React calls writable.flush() when available
    //  - https://github.com/brillout/vite-plugin-ssr/issues/466#issuecomment-1269601710
    const flushStream = () => {
      assert(writableOriginal)
      if (typeof writableOriginal.flush === 'function') {
        writableOriginal.flush()
        debug('stream flush() performed (Node.js Writable)')
      }
    }

    let hasEnded = false
    const endStream = () => {
      hasEnded = true
      if (writableOriginal) {
        writableOriginal.end()
      }
    }

    const { Writable } = await loadStreamNodeModule()
    const writableProxy = new Writable({
      async write(chunk, _encoding, callback) {
        onData(chunk)
        callback()
      },
      async destroy(err, callback) {
        if (err) {
          onError(err)
        } else {
          await onEnd()
        }
        callback(err)
        endStream()
      }
    })

    // Forward the flush() call
    objectAssign(writableProxy, {
      flush: () => {
        onFlush()
      }
    })
    assert(typeof writableProxy.flush === 'function')

    const pipeOriginal = getStreamPipeNode(streamOriginal)
    pipeOriginal(writableProxy)

    return { streamWrapper: pipeProxy as typeof streamOriginal, streamOperations: { writeChunk, flushStream } }
  }

  if (isStreamPipeWeb(streamOriginal)) {
    debug('render() hook returned Web Stream Pipe')

    let writerOriginal: null | WritableStreamDefaultWriter<unknown> = null
    const pipeProxy = (writableOriginal: StreamWritableWeb) => {
      writerOriginal = writableOriginal.getWriter()
      debug('original Web Writable received')
      ;(async () => {
        // CloudFlare Workers does not implement `ready` property
        //  - https://github.com/vuejs/vue-next/issues/4287
        try {
          await writerOriginal.ready
        } catch (e: any) {}
        onReadyToWrite()
        if (hasEnded) {
          // `onReadyToWrite()` already wrote everything; we can close the stream right away
          writerOriginal.close()
        }
      })()
    }
    stampPipe(pipeProxy, 'web-stream')
    const writeChunk = (chunk: unknown) => {
      assert(writerOriginal)
      writerOriginal.write(encodeForWebStream(chunk))
      if (debug.isEnabled) {
        debug('data written (Web Writable)', String(chunk))
      }
    }
    // Web Streams have compression built-in
    //  - https://developer.mozilla.org/en-US/docs/Web/API/Compression_Streams_API
    //  - It seems that there is no flush interface? Flushing just works automagically?
    const flushStream = null

    let hasEnded = false
    const endStream = () => {
      hasEnded = true
      if (writerOriginal) {
        writerOriginal.close()
      }
    }

    let writableProxy: WritableStream<unknown>
    if (typeof ReadableStream !== 'function') {
      writableProxy = new WritableStream({
        write(chunk) {
          onData(chunk)
        },
        async close() {
          await onEnd()
          endStream()
        },
        abort(err) {
          onError(err)
          endStream()
        }
      })
    } else {
      const { readable, writable } = new TransformStream()
      writableProxy = writable
      handleReadableWeb(readable, {
        onData,
        onError(err) {
          onError(err)
          endStream()
        },
        async onEnd() {
          await onEnd()
          endStream()
        }
      })
    }

    const pipeOriginal = getStreamPipeWeb(streamOriginal)
    pipeOriginal(writableProxy)

    return { streamWrapper: pipeProxy as typeof streamOriginal, streamOperations: { writeChunk, flushStream } }
  }

  if (isStreamReadableWeb(streamOriginal)) {
    debug('render() hook returned Web Readable')

    const readableOriginal: StreamReadableWeb = streamOriginal

    let controllerProxy: ReadableStreamController<unknown>
    assertReadableStreamConstructor()
    const readableProxy = new ReadableStream<unknown>({
      start(controller) {
        controllerProxy = controller
        onReadyToWrite()
        handleReadableWeb(readableOriginal, {
          onData,
          onError(err) {
            onError(err)
            controllerProxy.close()
          },
          async onEnd() {
            await onEnd()
            controllerProxy.close()
          }
        })
      }
    })

    const writeChunk = (chunk: unknown) => {
      controllerProxy.enqueue(encodeForWebStream(chunk))
      if (debug.isEnabled) {
        debug('data written (Web Readable)', String(chunk))
      }
    }
    // Readables don't have the notion of flushing
    const flushStream = null

    return { streamWrapper: readableProxy as typeof streamOriginal, streamOperations: { writeChunk, flushStream } }
  }

  if (isStreamReadableNode(streamOriginal)) {
    debug('render() hook returned Node.js Readable')

    const readableOriginal: StreamReadableNode = streamOriginal

    const { Readable } = await loadStreamNodeModule()
    // Vue doesn't always set the `read()` handler: https://github.com/brillout/vite-plugin-ssr/issues/138#issuecomment-934743375
    if (readableOriginal._read === Readable.prototype._read) {
      readableOriginal._read = function () {}
    }

    const writeChunk = (chunk: unknown) => {
      readableProxy.push(chunk)
      if (debug.isEnabled) {
        debug('data written (Node.js Readable)', String(chunk))
      }
    }
    // Readables don't have the notion of flushing
    const flushStream = null
    const closeProxy = () => {
      readableProxy.push(null)
    }
    const readableProxy: StreamReadableNode = new Readable({ read() {} })

    onReadyToWrite()

    readableOriginal.on('data', (chunk) => {
      onData(chunk)
    })
    readableOriginal.on('error', (err) => {
      onError(err)
      closeProxy()
    })
    readableOriginal.on('end', async () => {
      await onEnd()
      closeProxy()
    })

    return { streamWrapper: readableProxy as typeof streamOriginal, streamOperations: { writeChunk, flushStream } }
  }

  assert(false)
}

async function handleReadableWeb(
  readable: ReadableStream,
  {
    onData,
    onError,
    onEnd
  }: { onData: (chunk: unknown) => void; onError: (err: unknown) => void; onEnd: () => Promise<void> }
) {
  const reader = readable.getReader()
  while (true) {
    let result: ReadableStreamReadResult<unknown>
    try {
      result = await reader.read()
    } catch (err) {
      onError(err)
      return
    }
    const { value, done } = result
    if (done) {
      break
    }
    onData(value)
  }
  await onEnd()
}

function isStream(something: unknown): something is Stream {
  if (
    isStreamReadableWeb(something) ||
    isStreamReadableNode(something) ||
    isStreamPipeNode(something) ||
    isStreamPipeWeb(something) ||
    isStreamReactStreaming(something)
  ) {
    checkType<Stream>(something)
    return true
  }
  return false
}

const __streamPipeWeb = '__streamPipeWeb'
type StreamPipeWebWrapped = { [__streamPipeWeb]: StreamPipeWeb }
/** @deprecated */
function pipeWebStream(pipe: StreamPipeWeb): StreamPipeWebWrapped {
  assertWarning(false, 'pipeWebStream() is outdated, use stampPipe() instead. See https://vite-plugin-ssr.com/stream', {
    onlyOnce: true,
    showStackTrace: true
  })
  return { [__streamPipeWeb]: pipe }
}
function getStreamPipeWeb(thing: StreamPipeWebWrapped): StreamPipeWeb
function getStreamPipeWeb(thing: unknown): null | StreamPipeWeb
function getStreamPipeWeb(thing: unknown): null | StreamPipeWeb {
  if (!isStreamPipeWeb(thing)) {
    return null
  }
  if (isCallable(thing) && 'isWebStreamPipe' in thing) {
    // `stampPipe()`
    return thing as unknown as StreamPipeWeb
  } else {
    // `pipeWebStream()`
    return thing[__streamPipeWeb]
  }
}
function isStreamPipeWeb(thing: unknown): thing is StreamPipeWebWrapped {
  // `pipeWebStream()`
  if (isObject(thing) && __streamPipeWeb in thing) {
    return true
  }
  // `stampPipe()`
  if (isCallable(thing) && 'isWebStreamPipe' in thing) {
    return true
  }
  return false
}

const __streamPipeNode = '__streamPipeNode'
type StreamPipeNodeWrapped = { [__streamPipeNode]: StreamPipeNode }
/** @deprecated */
function pipeNodeStream(pipe: StreamPipeNode): StreamPipeNodeWrapped {
  assertWarning(
    false,
    'pipeNodeStream() is outdated, use stampPipe() instead. See https://vite-plugin-ssr.com/stream',
    { onlyOnce: true, showStackTrace: true }
  )
  return { [__streamPipeNode]: pipe }
}
function getStreamPipeNode(thing: StreamPipeNodeWrapped): StreamPipeNode
function getStreamPipeNode(thing: unknown): null | StreamPipeNode
function getStreamPipeNode(thing: unknown): null | StreamPipeNode {
  if (!isStreamPipeNode(thing)) {
    return null
  }
  if (isCallable(thing) && 'isNodeStreamPipe' in thing) {
    // `stampPipe()`
    return thing as unknown as StreamPipeNode
  } else {
    // `pipeNodeStream()`
    return thing[__streamPipeNode]
  }
}
function isStreamPipeNode(thing: unknown): thing is StreamPipeNodeWrapped {
  // `pipeNodeStream()`
  if (isObject(thing) && __streamPipeNode in thing) {
    return true
  }
  // `stampPipe()`
  if (isCallable(thing) && 'isNodeStreamPipe' in thing) {
    return true
  }
  return false
}

function stampPipe(pipe: StreamPipeNode | StreamPipeWeb, pipeType: 'web-stream' | 'node-stream') {
  assertUsage(pipeType, 'stampPipe(pipe, pipeType): argument `pipeType` is missing.)')
  assertUsage(
    ['web-stream', 'node-stream'].includes(pipeType),
    "stampPipe(pipe, pipeType): argument `pipeType` should be either 'web-stream' or 'node-stream'."
  )
  if (pipeType === 'node-stream') {
    Object.assign(pipe, { isNodeStreamPipe: true })
  } else {
    Object.assign(pipe, { isWebStreamPipe: true })
  }
}

const __streamPipe = '__streamPipe'
type StreamPipeWrapped = { [__streamPipe]: StreamPipe }
function pipeStream(pipe: StreamPipe): StreamPipeWrapped {
  return { [__streamPipe]: pipe }
}

async function streamToString(stream: Stream): Promise<string> {
  if (isStreamReadableWeb(stream)) {
    return await streamReadableWebToString(stream)
  }
  if (isStreamReadableNode(stream)) {
    return await streamReadableNodeToString(stream)
  }
  if (isStreamPipeNode(stream)) {
    return await streamPipeNodeToString(getStreamPipeNode(stream))
  }
  if (isStreamPipeWeb(stream)) {
    return await streamPipeWebToString(getStreamPipeWeb(stream))
  }
  if (isStreamReactStreaming(stream)) {
    return await streamReactStreamingToString(stream)
  }
  assert(false)
}

function assertReadableStreamConstructor() {
  assertUsage(
    typeof ReadableStream === 'function',
    // Error message copied from vue's `renderToWebStream()` implementation
    `ReadableStream constructor is not available in the global scope. ` +
      `If the target environment does support web streams, consider using ` +
      `pipeToWebWritable() with an existing WritableStream instance instead.`
  )
}

let encoder: TextEncoder
function encodeForWebStream(thing: unknown) {
  if (!encoder) {
    encoder = new TextEncoder()
  }
  if (typeof thing === 'string') {
    return encoder.encode(thing)
  }
  return thing
}

async function loadStreamNodeModule(): Promise<{
  Readable: typeof StreamReadableNode
  Writable: typeof StreamWritableNode
}> {
  const streamModule = await dynamicImport('stream')
  const { Readable, Writable } = streamModule as any
  return { Readable, Writable }
}

function dynamicImport(modulePath: string): Promise<Record<string, unknown>> {
  return new Function('modulePath', 'return import(modulePath)')(modulePath)
}

function getStreamName(type: 'pipe' | 'readable' | 'writable', standard: 'web' | 'node') {
  let standardName = capitalizeFirstLetter(standard)
  if (standardName === 'Node') {
    standardName = 'Node.js'
  }
  const typeName = capitalizeFirstLetter(type)
  if (type !== 'pipe') {
    return `a ${typeName} ${standardName} Stream`
  }
  if (type === 'pipe') {
    return `a ${standardName} Stream Pipe`
  }
  assert(false)
}

function inferStreamName(stream: Stream) {
  if (isStreamReadableWeb(stream)) {
    return getStreamName('readable', 'web')
  }
  if (isStreamReadableNode(stream)) {
    return getStreamName('readable', 'node')
  }
  if (isStreamPipeNode(stream)) {
    return getStreamName('pipe', 'node')
  }
  if (isStreamPipeWeb(stream)) {
    return getStreamName('pipe', 'web')
  }
  if (isStreamReactStreaming(stream)) {
    return 'the stream object provided by `react-streaming`'
  }
  assert(false)
}
