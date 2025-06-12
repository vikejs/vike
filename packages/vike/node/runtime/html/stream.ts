export { processStream }
export { streamToString }
export { stampPipe }
export { pipeStream }
export { pipeWebStream }
export { pipeNodeStream }
export { getStreamReadableNode }
export { getStreamReadableWeb }
export { pipeToStreamWritableNode }
export { pipeToStreamWritableWeb }
export { isStream }
export { isStreamPipeWeb }
export { isStreamPipeNode }
export { isStreamReadableWeb }
export { isStreamReadableNode }
export { getStreamName }
export { inferStreamName }
export { streamReadableWebToString }
export { streamPipeNodeToString }
export { isStreamWritableWeb }
export { isStreamWritableNode }
export type { StreamProviderAny }
export type { StreamProviderNormalized }
export type { StreamTypePatch }
export type { StreamReadableWeb }
export type { StreamReadableNode }
export type { StreamWritableWeb }
export type { StreamWritableNode }
export type { StreamPipeWeb }
export type { StreamPipeNode }

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
  createDebugger,
  isBug,
} from '../utils.js'
import { HtmlRender } from './renderHtml.js'
import {
  getStreamOfReactStreamingPackage,
  isStreamFromReactStreamingPackage,
  StreamFromReactStreamingPackagePublic,
  streamFromReactStreamingPackageToString,
} from './stream/react-streaming.js'
import { import_ } from '@brillout/import'
import type { Readable as Readable_, Writable as Writable_ } from 'node:stream'
import pc from '@brillout/picocolors'

const debug = createDebugger('vike:stream')

type StreamReadableWeb = ReadableStream
type StreamReadableNode = Readable_
type StreamWritableWeb = WritableStream
type StreamWritableNode = Writable_
type StreamPipeWeb = (writable: StreamWritableWeb) => void
type StreamPipeNode = (writable: StreamWritableNode) => void

type StreamProviderNormalized =
  | StreamReadableWeb
  | StreamReadableNode
  // stampPipe()
  | StreamPipeWeb
  // stampPipe()
  | StreamPipeNode
type StreamProviderAny =
  | StreamProviderNormalized
  | StreamFromReactStreamingPackagePublic
  // pipeWebStream()
  | StreamPipeWebWrapped
  // pipeNodeStream()
  | StreamPipeNodeWrapped

// Not needed but just to clarify StreamProvider vs StreamConsumer
type StreamConsumer = StreamWritableWeb | StreamWritableNode

// ReactDOMServer.renderToNodeStream() returns a NodeJS.ReadableStream which differs from Stream.Readable
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
  const reader = readableWeb.getReader()
  const { decode, getClosingChunk } = decodeChunks()
  let str: string = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    str += decode(value)
  }
  str += getClosingChunk()
  return str
}
async function stringToStreamReadableNode(str: string): Promise<StreamReadableNode> {
  const { Readable } = await loadStreamNodeModule()
  return Readable.from(str)
}
function stringToStreamReadableWeb(str: string): StreamReadableWeb {
  // ReadableStream.from() spec discussion: https://github.com/whatwg/streams/issues/1018
  assertReadableStreamConstructor()
  const readableStream = new ReadableStream({
    start(controller) {
      controller.enqueue(encodeForWebStream(str))
      controller.close()
    },
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
    },
  })
  streamPipeNode(writable)
  return promise
}
function streamPipeWebToString(streamPipeWeb: StreamPipeWeb): Promise<string> {
  const { decode, getClosingChunk } = decodeChunks()
  let str: string = ''
  let resolve: (s: string) => void
  const promise = new Promise<string>((r) => (resolve = r))
  const writable = new WritableStream({
    write(chunk) {
      str += decode(chunk)
    },
    close() {
      str += getClosingChunk()
      resolve(str)
    },
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
  if (isStreamPipeWeb(htmlRender)) {
    const streamPipeWeb = getStreamPipeWeb(htmlRender)
    assert(streamPipeWeb)

    const { readable, writable } = new TransformStream()
    streamPipeWeb(writable)
    return readable
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
  if (isStreamPipeWeb(htmlRender)) {
    const streamPipeWeb = getStreamPipeWeb(htmlRender)
    assert(streamPipeWeb)
    streamPipeWeb(writable)
    return true
  }
  if (isStreamReadableNode(htmlRender) || isStreamPipeNode(htmlRender)) {
    return false
  }
  checkType<never>(htmlRender)
  assert(false)
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
  if (isStreamPipeNode(htmlRender)) {
    const streamPipeNode = getStreamPipeNode(htmlRender)
    assert(streamPipeNode)
    streamPipeNode(writable)
    return true
  }
  if (isStreamReadableWeb(htmlRender) || isStreamPipeWeb(htmlRender)) {
    return false
  }
  checkType<never>(htmlRender)
  assert(false)
}

async function processStream(
  streamOriginal: StreamProviderAny,
  {
    injectStringAtBegin,
    injectStringAfterFirstChunk,
    injectStringAtEnd,
    onErrorWhileStreaming,
    enableEagerStreaming,
  }: {
    injectStringAtBegin?: () => Promise<string>
    injectStringAfterFirstChunk?: () => string | null
    injectStringAtEnd?: () => Promise<string>
    onErrorWhileStreaming: (err: unknown) => void
    enableEagerStreaming?: boolean
  },
): Promise<StreamProviderNormalized> {
  const buffer: unknown[] = []
  let streamOriginalHasStartedEmitting = false
  let streamOriginalEnded = false
  let streamClosed = false
  let onEndWasCalled = false
  let isReadyToWrite = false
  let wrapperCreated = false
  let shouldFlushStream = false
  let resolve: (result: StreamProviderNormalized) => void
  let reject: (err: unknown) => void
  let promiseHasResolved = false
  let injectStringAfterFirstChunk_done = false
  const streamWrapperPromise = new Promise<StreamProviderNormalized>((resolve_, reject_) => {
    resolve = (streamWrapper) => {
      promiseHasResolved = true
      resolve_(streamWrapper)
    }
    reject = (err) => {
      promiseHasResolved = true
      reject_(err)
    }
  })
  let resolveReadyToWrite: () => void
  const promiseReadyToWrite = new Promise<void>((r) => (resolveReadyToWrite = r))

  if (injectStringAtBegin) {
    const injectedChunk: string = await injectStringAtBegin()
    writeStream(injectedChunk) // Adds injectedChunk to buffer
    flushStream() // Sets shouldFlushStream to true
  }

  // We call onStreamEvent() also when the stream ends in order to properly handle the situation when the stream didn't emit any data
  const onStreamDataOrEnd = (cb: () => void) => {
    assert(streamOriginalEnded === false)
    streamOriginalHasStartedEmitting = true
    cb()
    if (wrapperCreated) resolvePromise()
  }

  const { streamWrapper, streamWrapperOperations } = await createStreamWrapper({
    streamOriginal,
    onReadyToWrite() {
      debug('stream begin')
      isReadyToWrite = true
      flushBuffer()
      resolveReadyToWrite()
    },
    onError(err) {
      if (!promiseHasResolved) {
        reject(err)
      } else {
        onErrorWhileStreaming(err)
      }
    },
    onData(chunk: unknown) {
      onStreamDataOrEnd(() => {
        writeStream(chunk)
        if (injectStringAfterFirstChunk && !injectStringAfterFirstChunk_done) {
          const injectedChunk = injectStringAfterFirstChunk()
          if (injectedChunk !== null) writeStream(injectedChunk)
          injectStringAfterFirstChunk_done = true
        }
      })
    },
    async onEnd(
      // Should we use this `isCancel`? Maybe we can skip `injectStringAtEnd()`?
      isCancel,
    ) {
      try {
        assert(!onEndWasCalled)
        onEndWasCalled = true
        debug('stream end')
        // We call onStreamEvent() also here in case the stream didn't emit any data
        onStreamDataOrEnd(() => {
          streamOriginalEnded = true
        })
        if (injectStringAtEnd) {
          const injectedChunk = await injectStringAtEnd()
          writeStream(injectedChunk)
        }
        await promiseReadyToWrite // E.g. if the user calls the pipe wrapper after the original writable has ended
        assert(isReady())
        flushBuffer()
        streamClosed = true
        debug('stream ended')
      } catch (err) {
        // Ideally, we should catch and gracefully handle user land errors, as any error thrown here kills the server. (I assume that the fact it kills the server is a Node.js bug?)

        // Show "[vike][Bug] You stumbled upon a bug in Vike's source code" to user while printing original error
        if (!isBug(err)) {
          console.error(err)
          assert(false)
        }

        throw err
      }
    },
    onFlush() {
      flushStream()
    },
  })
  wrapperCreated = true

  flushBuffer() // In case onReadyToWrite() was already called (the flushBuffer() of onReadyToWrite() wasn't called because `wrapperCreated === false`)

  if (!delayStreamStart()) resolvePromise()

  return streamWrapperPromise

  function writeStream(chunk: unknown) {
    buffer.push(chunk)
    flushBuffer()
  }

  function flushBuffer() {
    if (!isReady()) return
    assert(!streamClosed)
    buffer.forEach((chunk) => {
      streamWrapperOperations.writeChunk(chunk)
    })
    buffer.length = 0
    if (shouldFlushStream) flushStream()
  }

  function resolvePromise() {
    assert(!delayStreamStart()) // The stream promise shouldn't resolve before delayStreamStart()
    assert(wrapperCreated) // Doesn't make sense to resolve streamWrapper if it isn't defined yet
    debug('stream promise resolved')
    resolve(streamWrapper)
  }

  function flushStream() {
    if (!isReady()) {
      shouldFlushStream = true
      return
    }
    if (streamWrapperOperations.flushStream === null) return
    streamWrapperOperations.flushStream()
    shouldFlushStream = false
    debug('stream flushed')
  }

  function isReady() {
    /*
    console.log('isReadyToWrite', isReadyToWrite)
    console.log('wrapperCreated', wrapperCreated)
    console.log('!delayStreamStart()', !delayStreamStart())
    */
    return (
      isReadyToWrite &&
      // We can't use streamWrapperOperations.writeChunk() if it isn't defined yet
      wrapperCreated &&
      // See comment below
      !delayStreamStart()
    )
  }

  // Delay streaming, so that if the page shell fails then Vike is able to render the error page.
  //  - We can't erase the previously written stream data => we need to delay streaming if we want to be able to restart rendering anew for the error page
  //  - This is what React expects.
  //  - Does this make sense for UI frameworks other than React?
  //  - We don't need this anymore if we implement a client-side recover mechanism.
  //     - I.e. rendering the error page on the client-side if there is an error during the stream.
  //       - We cannot do this with Server Routing
  //     - Emitting the wrong status code doesn't matter with libraries like react-streaming which automatically disable streaming for bots. (Emitting the right status code only matters for bots.)
  function delayStreamStart() {
    return !enableEagerStreaming && !streamOriginalHasStartedEmitting
  }
}

async function createStreamWrapper({
  streamOriginal,
  onError,
  onData,
  onEnd,
  onFlush,
  onReadyToWrite,
}: {
  streamOriginal: StreamProviderAny
  onError: (err: unknown) => void
  onData: (chunk: unknown) => void
  onEnd: (isCancel?: boolean) => Promise<void>
  onFlush: () => void
  onReadyToWrite: () => void
}): Promise<{
  streamWrapper: StreamProviderNormalized
  streamWrapperOperations: { writeChunk: (chunk: unknown) => void; flushStream: null | (() => void) }
}> {
  if (isStreamFromReactStreamingPackage(streamOriginal)) {
    debug(`onRenderHtml() hook returned ${pc.cyan('react-streaming')} result`)
    const stream = getStreamOfReactStreamingPackage(streamOriginal)
    ;(streamOriginal as StreamProviderAny) = stream
  }

  if (isStreamPipeNode(streamOriginal)) {
    debug('onRenderHtml() hook returned Node.js Stream Pipe')

    let writableOriginal: null | (StreamWritableNode & { flush?: () => void }) = null
    const pipeProxy: StreamPipeNode = (writable_: StreamWritableNode) => {
      writableOriginal = writable_
      debug('original Node.js Writable received')
      onReadyToWrite()
      if (hasEnded) {
        // onReadyToWrite() already wrote everything; we can close the stream right away
        writableOriginal.end()
      }
    }
    stampPipe(pipeProxy, 'node-stream')
    const writeChunk = (chunk: unknown) => {
      assert(writableOriginal)
      writableOriginal.write(chunk)
      debugWithChunk('data written (Node.js Writable)', chunk)
    }
    // For libraries such as https://www.npmjs.com/package/compression
    //  - React calls writable.flush() when available
    //  - https://github.com/vikejs/vike/issues/466#issuecomment-1269601710
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
      },
    })

    // Forward the flush() call
    objectAssign(writableProxy, {
      flush: () => {
        onFlush()
      },
    })
    assert(typeof writableProxy.flush === 'function')

    const pipeOriginal = getStreamPipeNode(streamOriginal)
    pipeOriginal(writableProxy)

    return { streamWrapper: pipeProxy, streamWrapperOperations: { writeChunk, flushStream } }
  }

  if (isStreamPipeWeb(streamOriginal)) {
    debug('onRenderHtml() hook returned Web Stream Pipe')

    let writerOriginal: null | WritableStreamDefaultWriter<unknown> = null
    const pipeProxy: StreamPipeWeb = (writableOriginal: StreamWritableWeb) => {
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
          // onReadyToWrite() already wrote everything; we can close the stream right away
          writerOriginal.close()
        }
      })()
    }
    stampPipe(pipeProxy, 'web-stream')
    const writeChunk = (chunk: unknown) => {
      assert(writerOriginal)
      writerOriginal.write(encodeForWebStream(chunk))
      debugWithChunk('data written (Web Writable)', chunk)
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
        },
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
        },
      })
    }

    const pipeOriginal = getStreamPipeWeb(streamOriginal)
    pipeOriginal(writableProxy)

    return { streamWrapper: pipeProxy, streamWrapperOperations: { writeChunk, flushStream } }
  }

  if (isStreamReadableWeb(streamOriginal)) {
    debug('onRenderHtml() hook returned Web Readable')

    const readableOriginal: StreamReadableWeb = streamOriginal

    let isClosed = false
    let isCancel = false
    const closeStream = async () => {
      if (isClosed) return
      isClosed = true
      await onEnd(isCancel)
      controllerProxy.close()
    }
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
            await closeStream()
          },
        })
      },
      async cancel(...args) {
        isCancel = true
        await readableOriginal.cancel(...args)
        // If readableOriginal has implemented readableOriginal.cancel() then the onEnd() callback and therfore closeStream() may already have been called at this point
        await closeStream()
      },
    })

    const writeChunk = (chunk: unknown) => {
      if (
        // If readableOriginal doesn't implement readableOriginal.cancel() then it may still emit data after we close the stream. We therefore need to check whether the steam is closed.
        !isClosed
      ) {
        controllerProxy.enqueue(encodeForWebStream(chunk) as any)
        debugWithChunk('data written (Web Readable)', chunk)
      } else {
        debugWithChunk('data emitted but not written (Web Readable)', chunk)
      }
    }
    // Readables don't have the notion of flushing
    const flushStream = null

    return {
      streamWrapper: readableProxy as typeof streamOriginal,
      streamWrapperOperations: { writeChunk, flushStream },
    }
  }

  if (isStreamReadableNode(streamOriginal)) {
    debug('onRenderHtml() hook returned Node.js Readable')

    const readableOriginal: StreamReadableNode = streamOriginal

    const { Readable } = await loadStreamNodeModule()
    // Vue doesn't always set the read() handler: https://github.com/vikejs/vike/issues/138#issuecomment-934743375
    if (readableOriginal._read === Readable.prototype._read) {
      readableOriginal._read = function () {}
    }

    const writeChunk = (chunk: unknown) => {
      readableProxy.push(chunk)
      debugWithChunk('data written (Node.js Readable)', chunk)
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

    return {
      streamWrapper: readableProxy as typeof streamOriginal,
      streamWrapperOperations: { writeChunk, flushStream },
    }
  }

  assert(false)
}

async function handleReadableWeb(
  readable: ReadableStream,
  {
    onData,
    onError,
    onEnd,
  }: { onData: (chunk: unknown) => void; onError: (err: unknown) => void; onEnd: () => Promise<void> },
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

function isStream(something: unknown): something is StreamProviderAny {
  if (
    isStreamReadableWeb(something) ||
    isStreamReadableNode(something) ||
    isStreamPipeNode(something) ||
    isStreamPipeWeb(something) ||
    isStreamFromReactStreamingPackage(something)
  ) {
    checkType<StreamProviderAny>(something)
    return true
  }
  return false
}

const __streamPipeWeb = '__streamPipeWeb'
type StreamPipeWebWrapped = { [__streamPipeWeb]: StreamPipeWeb }
/** @deprecated */
function pipeWebStream(pipe: StreamPipeWeb): StreamPipeWebWrapped {
  assertWarning(false, 'pipeWebStream() is outdated, use stampPipe() instead. See https://vike.dev/streaming', {
    onlyOnce: true,
    showStackTrace: true,
  })
  return { [__streamPipeWeb]: pipe }
}
function getStreamPipeWeb(thing: StreamPipeWebWrapped | StreamPipeWeb): StreamPipeWeb
function getStreamPipeWeb(thing: unknown): null | StreamPipeWeb
function getStreamPipeWeb(thing: unknown): null | StreamPipeWeb {
  if (!isStreamPipeWeb(thing)) {
    return null
  }
  if (isObject(thing)) {
    // pipeWebStream()
    assert(__streamPipeWeb && thing)
    return thing[__streamPipeWeb]
  } else {
    // stampPipe()
    assert(isCallable(thing) && 'isWebStreamPipe' in thing)
    return thing
  }
}
function isStreamPipeWeb(thing: unknown): thing is StreamPipeWebWrapped | StreamPipeWeb {
  // pipeWebStream()
  if (isObject(thing) && __streamPipeWeb in thing) {
    return true
  }
  // stampPipe()
  if (isCallable(thing) && 'isWebStreamPipe' in thing) {
    return true
  }
  return false
}

const __streamPipeNode = '__streamPipeNode'
type StreamPipeNodeWrapped = { [__streamPipeNode]: StreamPipeNode }
/** @deprecated */
function pipeNodeStream(pipe: StreamPipeNode): StreamPipeNodeWrapped {
  assertWarning(false, 'pipeNodeStream() is outdated, use stampPipe() instead. See https://vike.dev/streaming', {
    onlyOnce: true,
    showStackTrace: true,
  })
  return { [__streamPipeNode]: pipe }
}
function getStreamPipeNode(thing: StreamPipeNodeWrapped | StreamPipeNode): StreamPipeNode
function getStreamPipeNode(thing: unknown): null | StreamPipeNode
function getStreamPipeNode(thing: unknown): null | StreamPipeNode {
  if (!isStreamPipeNode(thing)) {
    return null
  }
  if (isObject(thing)) {
    // pipeNodeStream()
    assert(__streamPipeNode in thing)
    return thing[__streamPipeNode]
  } else {
    // stampPipe()
    assert(isCallable(thing) && 'isNodeStreamPipe' in thing)
    return thing
  }
}
function isStreamPipeNode(thing: unknown): thing is StreamPipeNodeWrapped | StreamPipeNode {
  // pipeNodeStream()
  if (isObject(thing) && __streamPipeNode in thing) {
    return true
  }
  // stampPipe()
  if (isCallable(thing) && 'isNodeStreamPipe' in thing) {
    return true
  }
  return false
}

function stampPipe(pipe: StreamPipeNode | StreamPipeWeb, pipeType: 'web-stream' | 'node-stream') {
  assertUsage(pipeType, `stampPipe(pipe, pipeType): argument ${pc.cyan('pipeType')} is missing.)`, {
    showStackTrace: true,
  })
  assertUsage(
    ['web-stream', 'node-stream'].includes(pipeType),
    `stampPipe(pipe, pipeType): argument ${pc.cyan('pipeType')} should be either ${pc.cyan(
      "'web-stream'",
    )} or ${pc.cyan("'node-stream'")}.`,
    { showStackTrace: true },
  )
  if (pipeType === 'node-stream') {
    Object.assign(pipe, { isNodeStreamPipe: true })
  } else {
    Object.assign(pipe, { isWebStreamPipe: true })
  }
}

type StreamPipe = (writable: StreamWritableNode | StreamWritableWeb) => void
const __streamPipe = '__streamPipe'
type StreamPipeWrapped = { [__streamPipe]: StreamPipe }
function pipeStream(pipe: StreamPipe): StreamPipeWrapped {
  return { [__streamPipe]: pipe }
}

async function streamToString(stream: StreamProviderAny): Promise<string> {
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
  if (isStreamFromReactStreamingPackage(stream)) {
    return await streamFromReactStreamingPackageToString(stream)
  }
  assert(false)
}

function assertReadableStreamConstructor() {
  assertUsage(
    typeof ReadableStream === 'function',
    // Error message copied from vue's renderToWebStream() implementation
    "ReadableStream constructor isn't available in the global scope. " +
      'If the target environment does support web streams, consider using ' +
      'pipeToWebWritable() with an existing WritableStream instance instead.',
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

// Because of Cloudflare Workers, we cannot statically import the `stream` module, instead we dynamically import it.
async function loadStreamNodeModule(): Promise<{
  Readable: typeof Readable_
  Writable: typeof Writable_
}> {
  const streamModule = (await import_('stream')).default as Awaited<typeof import('stream')>
  const { Readable, Writable } = streamModule
  return { Readable, Writable }
}

function getStreamName(
  kind: 'pipe' | 'readable' | 'writable',
  type: 'web' | 'node',
): `a ${string} Stream` | `a ${string} Stream Pipe` {
  let typeName = capitalizeFirstLetter(type)
  if (typeName === 'Node') {
    typeName = 'Node.js'
  }
  const kindName = capitalizeFirstLetter(kind)
  if (kind !== 'pipe') {
    return `a ${kindName} ${typeName} Stream`
  }
  if (kind === 'pipe') {
    return `a ${typeName} Stream Pipe`
  }
  assert(false)
}

function inferStreamName(stream: StreamProviderNormalized) {
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
  assert(false)
}

function decodeChunks() {
  const decoder = new TextDecoder()
  const decode = (chunk: unknown): string => {
    if (typeof chunk === 'string') {
      return chunk
    } else if (chunk instanceof Uint8Array) {
      return decoder.decode(chunk, { stream: true })
    } else {
      assert(false)
    }
  }
  // https://github.com/vikejs/vike/pull/1799#discussion_r1713554096
  const getClosingChunk = (): string => {
    return decoder.decode()
  }
  return { decode, getClosingChunk }
}

function debugWithChunk(msg: string, chunk: unknown): void {
  if (!debug.isActivated) return

  let chunkStr: string
  try {
    chunkStr = new TextDecoder().decode(chunk as any)
  } catch (err) {
    chunkStr = String(chunk)
  }

  debug(msg, chunkStr)
}
