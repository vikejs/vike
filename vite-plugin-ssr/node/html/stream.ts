import { assert, assertUsage, checkType, isObject, hasProp } from '../utils'
import { HtmlRender } from './renderHtml'
// In order to support Cloudflare Workers, we cannot statically import the `stream` module.
// Instead we only import the types and dynamically import `stream` in `loadStreamNodeModule()`.
import type { Readable as StreamReadableNode, Writable as StreamWritableNode } from 'stream'
//import { streamNodeModuleGet as loadStreamNodeModule } from './stream/streamNodeModule'

export { getStreamReadableNode }
export { getStreamReadableWeb }
export { pipeToStreamWritableNode }
export { pipeToStreamWritableWeb }
export { manipulateStream }
export { isStream }
export { streamToString }

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

type StreamReadableWeb = ReadableStream
type StreamWritableWeb = WritableStream
//type StreamReadableNode = typeof import('stream').Readable
//type StreamWritableNode = typeof import('stream').Writable
type StreamPipeWeb = (writable: StreamWritableWeb) => void
type StreamPipeNode = (writable: StreamWritableNode) => void
type Stream = StreamReadableWeb | StreamReadableNode | StreamPipeWebWrapped | StreamPipeNodeWrapped
// `ReactDOMServer.renderToNodeStream()` returns a `NodeJS.ReadableStream` which differs from `Stream.Readable`
type StreamTypePatch = NodeJS.ReadableStream

function isStreamReadableWeb(thing: unknown): thing is StreamReadableWeb {
  return typeof ReadableStream !== 'undefined' && thing instanceof ReadableStream
}
function isStreamReadableNode(thing: unknown): thing is StreamReadableNode {
  if (isStreamReadableWeb(thing)) {
    return false
  }
  // https://stackoverflow.com/questions/17009975/how-to-test-if-an-object-is-a-stream-in-nodejs/37022523#37022523
  return hasProp(thing, 'read', 'function')
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
  let resolve: (s: string) => void
  const promise = new Promise<string>((r) => (resolve = r))
  const { Writable } = await loadStreamNodeModule()
  const writable = new Writable({
    write(chunk, _encoding, callback) {
      const s = chunk.toString()
      assert(typeof s === 'string')
      str += s
      callback()
    },
    final(callback) {
      resolve(str)
      callback()
    },
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
async function getStreamReadableWeb(htmlRender: HtmlRender): Promise<null | StreamReadableWeb> {
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
  const streamPipeWeb = getStreamPipeWeb(htmlRender)
  if (streamPipeWeb === null) {
    return false
  }
  streamPipeWeb(writable)
  return true
}
function pipeToStreamWritableNode(htmlRender: HtmlRender, writable: StreamWritableNode): boolean {
  if (typeof htmlRender === 'string') {
    const streamPipeNode = stringToStreamPipeNode(htmlRender)
    streamPipeNode(writable)
    return true
  }
  const streamPipeNode = getStreamPipeNode(htmlRender)
  if (streamPipeNode === null) {
    return false
  }
  streamPipeNode(writable)
  return true
}

type StreamWrapper<StreamType> = { stream: StreamType } | { errorBeforeFirstData: unknown }
async function manipulateStream<StreamType extends Stream>(
  streamOriginal: StreamType,
  {
    injectStringAtBegin,
    injectStringAtEnd,
    onErrorWhileStreaming,
  }: {
    injectStringAtBegin?: () => Promise<string>
    injectStringAtEnd?: () => Promise<string>
    onErrorWhileStreaming: (err: unknown) => void
  },
): Promise<StreamWrapper<StreamType>> {
  const getManipulationHandlers = ({
    writeData,
    closeStream,
    getStream,
  }: {
    writeData: (chunk: string) => void
    closeStream: () => void
    getStream: () => StreamType
  }) => {
    let resolve: (result: StreamWrapper<StreamType>) => void
    const streamPromise = new Promise<StreamWrapper<StreamType>>((r) => (resolve = r))

    let resolved = false
    const write = (chunk: string) => {
      writeData(chunk)
      if (resolved === false) {
        resolve({ stream: getStream() })
        resolved = true
      }
    }

    const ensureStringBegin = (() => {
      let promise: Promise<void> | null = null
      return async () => {
        if (promise === null) {
          promise = new Promise<void>(async (resolve) => {
            if (injectStringAtBegin) {
              const stringBegin = await injectStringAtBegin()
              write(stringBegin)
            }
            resolve()
          })
        }
        await promise
      }
    })()

    const onData = async (chunk: string) => {
      await ensureStringBegin()

      write(chunk)
    }
    const onEnd = async () => {
      // If empty stream: the stream ends before any data was written, but we still need to ensure that we inject `stringBegin`
      await ensureStringBegin()

      if (injectStringAtEnd) {
        const stringEnd = await injectStringAtEnd()
        write(stringEnd)
      }

      closeStream()
    }
    const onError = async (err: unknown) => {
      if (resolved === false) {
        closeStream()
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
      onEnd,
      onError,
      streamPromise,
    }
  }

  if (isStreamPipeNode(streamOriginal)) {
    const buffer: string[] = []
    const { onData, onEnd, /*onError,*/ streamPromise } = getManipulationHandlers({
      writeData(chunk: string) {
        if (!writableOriginalReady) {
          buffer.push(chunk)
        } else {
          const write = (c: unknown) => {
            writableOriginal.write(c)
          }
          if (buffer.length !== 0) {
            buffer.forEach((c) => write(c))
            buffer.length = 0
          }
          write(chunk)
        }
      },
      closeStream() {
        if (!writableOriginalReady) {
          return
        }
        writableOriginal.end()
      },
      getStream() {
        checkType<StreamPipeNodeWrapped>(pipeNodeWrapper)
        checkType<StreamPipeNodeWrapped>(streamOriginal)
        const stream = pipeNodeWrapper as typeof streamOriginal
        return stream
      },
    })
    let writableOriginal: StreamWritableNode
    let writableOriginalReady = false
    const pipeNodeWrapper = pipeNodeStream((writable_: StreamWritableNode) => {
      writableOriginal = writable_
      writableOriginalReady = true
    })
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
    })
    const streamPipeNode = getStreamPipeNode(streamOriginal)
    streamPipeNode(writableProxy)
    return streamPromise
  }

  if (isStreamPipeWeb(streamOriginal)) {
    const buffer: string[] = []
    const { onData, onEnd, onError, streamPromise } = getManipulationHandlers({
      writeData(chunk: string) {
        if (!writableOriginalReady) {
          buffer.push(chunk)
        } else {
          const write = (c: unknown) => {
            writerOriginal.write(encodeForWebStream(c))
          }
          if (buffer.length !== 0) {
            buffer.forEach((c) => write(c))
            buffer.length = 0
          }
          write(chunk)
        }
      },
      closeStream() {
        if (!writableOriginalReady) {
          return
        }
        writerOriginal.close()
      },
      getStream() {
        checkType<StreamPipeWebWrapped>(pipeWebWrapper)
        checkType<StreamPipeWebWrapped>(streamOriginal)
        const stream = pipeWebWrapper as typeof streamOriginal
        return stream
      },
    })
    let writerOriginal: WritableStreamDefaultWriter<any>
    let writableOriginalReady = false
    const pipeWebWrapper = pipeWebStream((writableOriginal: StreamWritableWeb) => {
      writerOriginal = writableOriginal.getWriter()
      ;(async () => {
        // CloudFlare workers do not implement `ready` property
        //  - https://github.com/vuejs/vue-next/issues/4287
        try {
          await writerOriginal.ready
        } catch (e: any) {}
        writableOriginalReady = true
      })()
    })
    let writableProxy: WritableStream
    if (typeof ReadableStream !== 'function') {
      writableProxy = new WritableStream({
        write(chunk) {
          onData(chunk)
        },
        close() {
          onEnd()
        },
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
    const readableWebOriginal: StreamReadableWeb = streamOriginal
    const { onData, onEnd, onError, streamPromise } = getManipulationHandlers({
      writeData(chunk: string) {
        controller.enqueue(encodeForWebStream(chunk))
      },
      closeStream() {
        controller.close()
      },
      getStream() {
        checkType<StreamReadableWeb>(readableWebWrapper)
        checkType<StreamReadableWeb>(streamOriginal)
        const stream = readableWebWrapper as typeof streamOriginal
        return stream
      },
    })
    let controller: ReadableStreamController<any>
    assertReadableStreamConstructor()
    const readableWebWrapper = new ReadableStream({
      async start(controller_) {
        controller = controller_
        handleReadableWeb(readableWebOriginal, { onData, onError, onEnd })
      },
    })
    return streamPromise
  }

  if (isStreamReadableNode(streamOriginal)) {
    const readableNodeOriginal: StreamReadableNode = streamOriginal
    const { Readable } = await loadStreamNodeModule()
    // Vue doesn't always set the `read()` handler: https://github.com/brillout/vite-plugin-ssr/issues/138#issuecomment-934743375
    if (readableNodeOriginal._read === Readable.prototype._read) {
      readableNodeOriginal._read = function () {}
    }
    const readableNodeWrapper: StreamReadableNode = new Readable({ read() {} })
    const { onData, onEnd, onError, streamPromise } = getManipulationHandlers({
      writeData(chunk: string) {
        readableNodeWrapper.push(chunk)
      },
      closeStream() {
        readableNodeWrapper.push(null)
      },
      getStream() {
        checkType<StreamReadableNode>(readableNodeWrapper)
        checkType<StreamReadableNode>(streamOriginal)
        const stream = readableNodeWrapper as typeof streamOriginal
        return stream
      },
    })
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
  { onData, onError, onEnd }: { onData: (chunk: string) => void; onError: (err: unknown) => void; onEnd: () => void },
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
    isStreamPipeWeb(something)
  ) {
    checkType<Stream>(something)
    return true
  }
  return false
}

const __streamPipeWeb = '__streamPipeWeb'
type StreamPipeWebWrapped = { [__streamPipeWeb]: StreamPipeWeb }
function pipeWebStream(pipe: StreamPipeWeb): StreamPipeWebWrapped {
  return { [__streamPipeWeb]: pipe }
}
function getStreamPipeWeb(thing: StreamPipeWebWrapped): StreamPipeWeb
function getStreamPipeWeb(thing: unknown): null | StreamPipeWeb
function getStreamPipeWeb(thing: unknown): null | StreamPipeWeb {
  if (isStreamPipeWeb(thing)) {
    return thing[__streamPipeWeb]
  }
  return null
}
function isStreamPipeWeb(something: unknown): something is StreamPipeWebWrapped {
  return isObject(something) && __streamPipeWeb in something
}

const __streamPipeNode = '__streamPipeNode'
type StreamPipeNodeWrapped = { [__streamPipeNode]: StreamPipeNode }
function pipeNodeStream(pipe: StreamPipeNode): StreamPipeNodeWrapped {
  return { [__streamPipeNode]: pipe }
}
function getStreamPipeNode(thing: StreamPipeNodeWrapped): StreamPipeNode
function getStreamPipeNode(thing: unknown): null | StreamPipeNode
function getStreamPipeNode(thing: unknown): null | StreamPipeNode {
  if (isStreamPipeNode(thing)) {
    return thing[__streamPipeNode]
  }
  return null
}
function isStreamPipeNode(something: unknown): something is StreamPipeNodeWrapped {
  return isObject(something) && __streamPipeNode in something
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
  checkType<never>(stream)
  assert(false)
}

function assertReadableStreamConstructor() {
  assertUsage(
    typeof ReadableStream === 'function',
    // Error message copied from vue's `renderToWebStream()` implementation
    `ReadableStream constructor is not available in the global scope. ` +
      `If the target environment does support web streams, consider using ` +
      `pipeToWebWritable() with an existing WritableStream instance instead.`,
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
  // Eval to avoid bundlers to try to include the `stream` module
  const streamModule = await dynamicImport('stream')
  const { Readable, Writable } = streamModule as any
  return { Readable, Writable }
}

function dynamicImport(modulePath: string): Promise<Record<string, unknown>> {
  return new Function('modulePath', 'return import(modulePath)')(modulePath)
}
