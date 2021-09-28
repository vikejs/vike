import { Readable, Writable } from 'stream'
import { assert, checkType, isObject } from '../../shared/utils'
import { HtmlRender } from './renderHtml'

export { getNodeStream }
export { getWebStream }
export { pipeToStreamWritableNode }
export { pipeToStreamWritableWeb }
export { isStreamReadableWeb }
export { isStreamReadableNode }
export { streamReadableNodeToString }
export { streamReadableWebToString }
export { streamPipeWebToString }
export { streamPipeNodeToString }
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

// Public
export { pipeWebStream }
export { pipeNodeStream }

type StreamReadableWeb = ReadableStream
type StreamWritableWeb = WritableStream
type StreamReadableNode = Readable
type StreamWritableNode = Writable
type StreamPipeWeb = (writable: StreamWritableWeb) => void
type StreamPipeNode = (writable: StreamWritableNode) => void
type Stream = StreamReadableWeb | StreamReadableNode | StreamPipeWebWrapped | StreamPipeNodeWrapped
// `ReactDOMServer.renderToNodeStream()` returns a `NodeJS.ReadableStream` which differs from `Stream.Readable`
type StreamTypePatch = NodeJS.ReadableStream

function isStreamReadableWeb(thing: unknown): thing is StreamReadableWeb {
  return typeof ReadableStream !== 'undefined' && thing instanceof ReadableStream
}
function isStreamReadableNode(thing: unknown): thing is StreamReadableNode {
  return thing instanceof Readable
}

async function streamReadableNodeToString(readableNode: Readable): Promise<string> {
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
function stringToStreamReadableNode(str: string): StreamReadableNode {
  return Readable.from(str)
}
function stringToStreamReadableWeb(str: string): StreamReadableWeb {
  // `ReadableStream.from()` spec discussion: https://github.com/whatwg/streams/issues/1018
  const readableStream = new ReadableStream({
    start(controller) {
      controller.enqueue(str)
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
    const encoder = new TextEncoder()
    writer.write(encoder.encode(str))
    writer.close()
  }
}

function streamPipeNodeToString(streamPipeNode: StreamPipeNode): Promise<string> {
  let str: string = ''
  let resolve: (s: string) => void
  const promise = new Promise<string>((r) => (resolve = r))
  const writable = new Writable({
    write(chunk, encoding, callback) {
      assert(encoding === 'utf8')
      const s = chunk.toString()
      assert(typeof s === 'string')
      str += s
      callback()
    },
    final(callback) {
      resolve(str)
      callback()
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

function getNodeStream(htmlRender: HtmlRender): null | StreamReadableNode {
  if (typeof htmlRender === 'string') {
    return stringToStreamReadableNode(htmlRender)
  }
  if (isStreamReadableNode(htmlRender)) {
    return htmlRender
  }
  return null
}
function getWebStream(htmlRender: HtmlRender): null | StreamReadableWeb {
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
    onErrorWhileStreaming
  }: {
    injectStringAtBegin?: () => Promise<string>
    injectStringAtEnd?: () => Promise<string>
    onErrorWhileStreaming: (err: Error) => void
  }
): Promise<StreamWrapper<StreamType>> {
  const getManipulationHandlers = ({
    writeData,
    closeStream,
    getStream
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
    const onError = async (err: Error) => {
      closeStream()

      if (resolved === false) {
        // Stream has not begun yet, which means that we have sent no HTML to the browser, and we can gracefully abort the stream.
        resolve({ errorBeforeFirstData: err })
      } else {
        onEnd()
        // Some HTML as already been sent to the browser
        onErrorWhileStreaming(err)
      }
    }

    return {
      onData,
      onEnd,
      onError,
      streamPromise
    }
  }

  if (isStreamPipeNode(streamOriginal)) {
    const pipeNodeWrapper = pipeNodeStream((writable: StreamWritableNode) => {
      writable.write(injectStringAtBegin)
      const writableProxy = new Writable({
        write(chunk, _encoding, callback) {
          writable.write(chunk)
          callback()
        },
        final(callback) {
          writable.write(injectStringAtEnd)
          writable.end()
          callback()
        }
      })
      const streamPipeNode = getStreamPipeNode(streamOriginal)
      streamPipeNode(writableProxy)
    })
    const stream = pipeNodeWrapper as typeof streamOriginal
    return { stream }
  }

  if (isStreamPipeWeb(streamOriginal)) {
    const pipeWebWrapper = pipeWebStream((writable: StreamWritableWeb) => {
      const writer = writable.getWriter()
      writer.write(injectStringAtBegin)
      const writableProxy = new WritableStream({
        write(chunk) {
          writer.write(chunk)
        },
        close() {
          writer.write(injectStringAtEnd)
          writer.close()
        }
      })
      const streamPipeWeb = getStreamPipeWeb(streamOriginal)
      streamPipeWeb(writableProxy)
    })
    const stream = pipeWebWrapper as typeof streamOriginal
    return { stream }
  }

  if (isStreamReadableWeb(streamOriginal)) {
    const readableWebOriginal: StreamReadableWeb = streamOriginal
    const readableWebWrapper = new ReadableStream({
      async start(controller) {
        controller.enqueue(injectStringAtBegin)
        const reader = readableWebOriginal.getReader()
        while (true) {
          const { value, done } = await reader.read()
          if (done) {
            break
          }
          controller.enqueue(value)
        }
        controller.enqueue(injectStringAtEnd)
        controller.close()
      }
    }) as typeof streamOriginal
    const stream = readableWebWrapper as typeof streamOriginal
    return { stream }
  }

  if (isStreamReadableNode(streamOriginal)) {
    const readableNodeOriginal: StreamReadableNode = streamOriginal
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
        //checkType<typeof streamOriginal>(readableNodeWrapper)
        const stream = readableNodeWrapper as typeof streamOriginal
        return stream
      }
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

const __streamPipeWeb = Symbol('__streamPipeWeb')
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

const __streamPipeNode = Symbol('__streamPipeNode')
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
    return streamPipeNodeToString(getStreamPipeNode(stream))
  }
  if (isStreamPipeWeb(stream)) {
    return streamPipeWebToString(getStreamPipeWeb(stream))
  }
  checkType<never>(stream)
  assert(false)
}
