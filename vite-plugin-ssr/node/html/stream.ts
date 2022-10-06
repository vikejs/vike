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
export { pipeWebStream }
export { pipeNodeStream }
export { stampPipe }
export { pipeStream }

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

type StreamWrapper<StreamType> = { stream: StreamType } | { errorBeforeFirstData: unknown }
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
): Promise<StreamWrapper<StreamType>> {
  const getManipulationHandlers = ({
    writeData,
    closeStream,
    getStream,
    flush
  }: {
    writeData: (chunk: unknown) => void
    closeStream: () => void
    getStream: () => StreamType
    flush?: () => void
  }) => {
    let resolve: (result: StreamWrapper<StreamType>) => void
    const streamPromise = new Promise<StreamWrapper<StreamType>>((r) => (resolve = r))

    let streamClosed = false
    const close = () => {
      if (streamClosed) {
        return
      }
      streamClosed = true
      closeStream()
    }

    let streamStarted = false
    const write = (chunk: unknown) => {
      writeData(chunk)
      if (streamStarted === false) {
        resolve({ stream: getStream() })
        streamStarted = true
      }
    }

    const streamBegin = (() => {
      let promise: Promise<void> | null = null
      return async () => {
        if (promise === null) {
          debug('vite-plugin-ssr wrapper stream begin')
          promise = new Promise<void>(async (resolve) => {
            if (injectStringAtBegin) {
              // Not sure why but this is needed for https://www.npmjs.com/package/compression
              const stringBegin = await injectStringAtBegin()
              write(stringBegin)
              if (flush) {
                debug('stream flush() call (vite-plugin-ssr)')
                flush()
              }
              debug('begin injection done')
            } else {
              debug('no begin injection')
            }
            resolve()
          })
        }
        await promise
      }
    })()

    const onData = async (chunk: unknown) => {
      await streamBegin()
      write(chunk)
    }

    const onBegin = () => {
      if (enableEagerStreaming) {
        streamBegin()
      }
    }

    let streamEnded = false
    const onEnd = async () => {
      if (streamEnded) {
        return
      }
      streamEnded = true
      debug('original stream ended')

      // If empty stream: the stream ends before any data was written, but we still need to ensure that we inject `stringBegin`
      await streamBegin()

      if (injectStringAtEnd) {
        const stringEnd = await injectStringAtEnd()
        write(stringEnd)
        if (flush) {
          debug('stream flush() call (vite-plugin-ssr)')
          flush()
        }
        debug('end injection done')
      } else {
        debug('no end injection')
      }

      close()
      debug('vite-plugin-ssr wrapper stream ended')
    }
    const onError = async (err: unknown) => {
      if (streamStarted === false) {
        close()
        // Stream has not begun yet, which means that we have sent no HTML to the browser, and we can gracefully abort the stream.
        resolve({ errorBeforeFirstData: err })
      } else {
        await onEnd()
        // Some HTML as already been sent to the browser
        onErrorWhileStreaming(err)
      }
    }

    return {
      onData,
      onBegin,
      onEnd,
      onError,
      streamPromise
    }
  }

  if (isStreamReactStreaming(streamOriginal)) {
    debug('render() hook returned `react-streaming` result')
    const stream = getStreamFromReactStreaming(streamOriginal)
    ;(streamOriginal as Stream) = stream
  }

  if (isStreamPipeNode(streamOriginal)) {
    debug('render() hook returned Node.js Stream Pipe')
    const buffer: unknown[] = []
    const flushBuffer = () => {
      assert(writableOriginalReady)
      assert(writableOriginal)
      if (buffer.length !== 0) {
        buffer.forEach((chunk) => {
          writableOriginal.write(chunk)
          if (debug.isEnabled) {
            debug('data written (from buffer) (Node.js Writable)', String(chunk))
          }
        })
        buffer.length = 0
        debug('buffer flushed (Node.js Writable)')
      }
      if (streamEnded) {
        writableOriginal.end()
      }
    }
    let streamEnded = false
    let shouldFlush = false
    const flush = () => {
      if (writableOriginalReady && typeof writableOriginal.flush === 'function') {
        writableOriginal.flush()
        debug('stream flush() success (Node.js Writable)')
        shouldFlush = false
      } else {
        debug('stream flush() postponed (Node.js Writable)')
        shouldFlush = true
      }
    }
    const { onData, onBegin, onEnd, onError, streamPromise } = getManipulationHandlers({
      writeData(chunk: unknown) {
        if (!writableOriginalReady) {
          buffer.push(chunk)
          debug('data buffered (Node.js Writable)')
        } else {
          flushBuffer()
          writableOriginal.write(chunk)
          if (debug.isEnabled) {
            debug('data written (Node.js Writable)', String(chunk))
          }
          if (shouldFlush) flush()
        }
      },
      flush,
      closeStream() {
        streamEnded = true
        if (!writableOriginalReady) {
          return
        }
        assert(buffer.length === 0)
        writableOriginal.end()
      },
      getStream() {
        checkType<StreamPipeNode>(pipeNodeWrapper)
        checkType<StreamPipeNodeWrapped>(streamOriginal)
        const stream = pipeNodeWrapper as typeof streamOriginal
        return stream
      }
    })
    onBegin()
    let writableOriginal: StreamWritableNode & { flush?: () => void }
    let writableOriginalReady = false
    const pipeNodeWrapper = (writable_: StreamWritableNode) => {
      writableOriginal = writable_
      writableOriginalReady = true
      debug('original stream received (Node.js Writable)')
      flushBuffer()
      if (shouldFlush) flush()
    }
    stampPipe(pipeNodeWrapper, 'node-stream')
    const { Writable } = await loadStreamNodeModule()
    const writableProxy = new Writable({
      async write(chunk, _encoding, callback) {
        await onData(chunk)
        callback()
      },
      async final(callback) {
        await onEnd()
        callback()
      },
      async destroy(err) {
        if (err) {
          await onError(err)
        } else {
          await onEnd()
        }
      }
    })

    // Forward the flush() call. E.g. used by React to flush GZIP buffers, see https://github.com/brillout/vite-plugin-ssr/issues/466#issuecomment-1269601710
    objectAssign(writableProxy, {
      flush: () => {
        debug('stream flush() call (original stream)')
        flush()
      }
    })
    assert(typeof writableProxy.flush === 'function')

    const streamPipeNode = getStreamPipeNode(streamOriginal)
    streamPipeNode(writableProxy)
    return streamPromise
  }

  if (isStreamPipeWeb(streamOriginal)) {
    debug('render() hook returned Web Stream Pipe')
    const buffer: unknown[] = []
    const flushBuffer = () => {
      assert(writableOriginalReady)
      assert(writerOriginal)
      if (buffer.length !== 0) {
        buffer.forEach((chunk) => {
          write(chunk)
          if (debug.isEnabled) {
            debug('data written (from buffer) (Web Writable)', String(chunk))
          }
        })
        buffer.length = 0
        debug('buffer flushed (Web Writable)')
      }
      if (streamEnded) {
        writerOriginal.close()
      }
    }
    const write = (chunk: unknown) => {
      assert(writableOriginalReady)
      writerOriginal.write(encodeForWebStream(chunk))
    }
    let streamEnded = false
    const { onData, onBegin, onEnd, onError, streamPromise } = getManipulationHandlers({
      writeData(chunk: unknown) {
        if (!writableOriginalReady) {
          buffer.push(chunk)
          debug('data buffered (Web Writable)')
        } else {
          flushBuffer()
          write(chunk)
          if (debug.isEnabled) {
            debug('data written (Web Writable)', String(chunk))
          }
        }
      },
      closeStream() {
        streamEnded = true
        if (!writableOriginalReady) {
          return
        }
        assert(buffer.length === 0)
        writerOriginal.close()
      },
      getStream() {
        checkType<StreamPipeWeb>(pipeWebWrapper)
        checkType<StreamPipeWebWrapped>(streamOriginal)
        const stream = pipeWebWrapper as typeof streamOriginal
        return stream
      }
    })
    onBegin()
    let writerOriginal: WritableStreamDefaultWriter<unknown>
    let writableOriginalReady = false
    const pipeWebWrapper = (writableOriginal: StreamWritableWeb) => {
      writerOriginal = writableOriginal.getWriter()
      ;(async () => {
        // CloudFlare Workers does not implement `ready` property
        //  - https://github.com/vuejs/vue-next/issues/4287
        try {
          await writerOriginal.ready
        } catch (e: any) {}
        writableOriginalReady = true
        debug('original stream received (Web Writable)')
        flushBuffer()
      })()
    }
    stampPipe(pipeWebWrapper, 'web-stream')
    let writableProxy: WritableStream
    if (typeof ReadableStream !== 'function') {
      writableProxy = new WritableStream({
        write(chunk) {
          onData(chunk)
        },
        close() {
          onEnd()
        }
      })
    } else {
      const { readable, writable } = new TransformStream()
      writableProxy = writable
      handleReadableWeb(readable, { onData, onError, onEnd })
    }
    const streamPipeWeb = getStreamPipeWeb(streamOriginal)
    streamPipeWeb(writableProxy)
    return streamPromise
  }

  if (isStreamReadableWeb(streamOriginal)) {
    debug('render() hook returned Web Readable')
    const readableWebOriginal: StreamReadableWeb = streamOriginal
    const { onData, onBegin, onEnd, onError, streamPromise } = getManipulationHandlers({
      writeData(chunk: unknown) {
        controller.enqueue(encodeForWebStream(chunk))
        if (debug.isEnabled) {
          debug('data written (Web Readable)', String(chunk))
        }
      },
      closeStream() {
        controller.close()
      },
      getStream() {
        checkType<StreamReadableWeb>(readableWebWrapper)
        checkType<StreamReadableWeb>(streamOriginal)
        const stream = readableWebWrapper as typeof streamOriginal
        return stream
      }
    })
    onBegin()
    let controller: ReadableStreamController<any>
    assertReadableStreamConstructor()
    const readableWebWrapper = new ReadableStream({
      start(controller_) {
        controller = controller_
        handleReadableWeb(readableWebOriginal, { onData, onError, onEnd })
      }
    })
    return streamPromise
  }

  if (isStreamReadableNode(streamOriginal)) {
    debug('render() hook returned Node.js Readable')
    const readableNodeOriginal: StreamReadableNode = streamOriginal
    const { Readable } = await loadStreamNodeModule()
    // Vue doesn't always set the `read()` handler: https://github.com/brillout/vite-plugin-ssr/issues/138#issuecomment-934743375
    if (readableNodeOriginal._read === Readable.prototype._read) {
      readableNodeOriginal._read = function () {}
    }
    const readableNodeWrapper: StreamReadableNode = new Readable({ read() {} })
    const { onData, onBegin, onEnd, onError, streamPromise } = getManipulationHandlers({
      writeData(chunk: unknown) {
        readableNodeWrapper.push(chunk)
        if (debug.isEnabled) {
          debug('data written (Node.js Readable)', String(chunk))
        }
      },
      closeStream() {
        readableNodeWrapper.push(null)
      },
      getStream() {
        checkType<StreamReadableNode>(readableNodeWrapper)
        checkType<StreamReadableNode>(streamOriginal)
        const stream = readableNodeWrapper as typeof streamOriginal
        return stream
      }
    })
    onBegin()
    readableNodeOriginal.on('data', async (chunk) => {
      onData(chunk)
    })
    readableNodeOriginal.on('error', async (err) => {
      onError(err)
    })
    readableNodeOriginal.on('end', async () => {
      onEnd()
    })
    return streamPromise
  }

  assert(false)
}

async function handleReadableWeb(
  readable: ReadableStream,
  { onData, onError, onEnd }: { onData: (chunk: unknown) => void; onError: (err: unknown) => void; onEnd: () => void }
) {
  const reader = readable.getReader()
  while (true) {
    let result: ReadableStreamDefaultReadResult<any>
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
  onEnd()
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
