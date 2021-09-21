import { Readable, Writable } from 'stream'
import { assert, checkType, isObject } from '../../shared/utils'
import { EscapeResult } from './escapeInject'

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
export { addStringWrapperToStream }
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

function getNodeStream(escapeResult: EscapeResult): null | StreamReadableNode {
  if (typeof escapeResult === 'string') {
    return stringToStreamReadableNode(escapeResult)
  }
  if (isStreamReadableNode(escapeResult)) {
    return escapeResult
  }
  return null
}
function getWebStream(escapeResult: EscapeResult): null | StreamReadableWeb {
  if (typeof escapeResult === 'string') {
    return stringToStreamReadableWeb(escapeResult)
  }
  if (isStreamReadableWeb(escapeResult)) {
    return escapeResult
  }
  return null
}

function pipeToStreamWritableWeb(escapeResult: EscapeResult, writable: StreamWritableWeb): boolean {
  if (typeof escapeResult === 'string') {
    const streamPipeWeb = stringToStreamPipeWeb(escapeResult)
    streamPipeWeb(writable)
    return true
  }
  const streamPipeWeb = getStreamPipeWeb(escapeResult)
  if (streamPipeWeb === null) {
    return false
  }
  streamPipeWeb(writable)
  return true
}
function pipeToStreamWritableNode(escapeResult: EscapeResult, writable: StreamWritableNode): boolean {
  if (typeof escapeResult === 'string') {
    const streamPipeNode = stringToStreamPipeNode(escapeResult)
    streamPipeNode(writable)
    return true
  }
  const streamPipeNode = getStreamPipeNode(escapeResult)
  if (streamPipeNode === null) {
    return false
  }
  streamPipeNode(writable)
  return true
}

f(1)
function f<T>(a: T): T {
  if (typeof a === 'number') {
    return 2 as typeof a
  }
  return a
}

function addStringWrapperToStream<T extends Stream>(stream: T, stringBegin: string, stringEnd: string): T {
  if (isStreamPipeNode(stream)) {
    return pipeNodeStream((writable: StreamWritableNode) => {
      writable.write(stringBegin)
      const writableProxy = new Writable({
        write(chunk, _encoding, callback) {
          writable.write(chunk)
          callback()
        },
        final(callback) {
          writable.write(stringEnd)
          writable.end()
          callback()
        }
      })
      const streamPipeNode = getStreamPipeNode(stream)
      streamPipeNode(writableProxy)
    }) as typeof stream
  }
  if (isStreamPipeWeb(stream)) {
    return pipeWebStream((writable: StreamWritableWeb) => {
      const writer = writable.getWriter()
      writer.write(stringBegin)
      const writableProxy = new WritableStream({
        write(chunk) {
          writer.write(chunk)
        },
        close() {
          writer.write(stringEnd)
          writer.close()
        }
      })
      const streamPipeWeb = getStreamPipeWeb(stream)
      streamPipeWeb(writableProxy)
    }) as typeof stream
  }
  if (isStreamReadableWeb(stream)) {
    return new ReadableStream({
      async start(controller) {
        controller.enqueue(stringBegin)
        const readableWeb: StreamReadableWeb = stream
        const reader = readableWeb.getReader()
        while (true) {
          const { value, done } = await reader.read()
          if (done) {
            break
          }
          controller.enqueue(value)
        }
        controller.enqueue(stringEnd)
        controller.close()
      }
    }) as typeof stream
  }
  if (isStreamReadableNode(stream)) {
    const readableNodeProxy: StreamReadableNode = new Readable({ read() {} })
    readableNodeProxy.push(stringBegin)
    const readableNode: StreamReadableNode = stream
    readableNode.on('data', (chunk) => readableNodeProxy.push(chunk))
    readableNode.on('error', (err) => readableNodeProxy.destroy(err))
    readableNode.on('end', () => {
      readableNodeProxy.push(stringEnd)
      readableNodeProxy.push(null)
    })
    return readableNodeProxy as typeof stream
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

async function streamToString(escapeResult: Stream): Promise<string> {
  if (isStreamReadableWeb(escapeResult)) {
    return await streamReadableWebToString(escapeResult)
  }
  if (isStreamReadableNode(escapeResult)) {
    return await streamReadableNodeToString(escapeResult)
  }
  if (isStreamPipeNode(escapeResult)) {
    return streamPipeNodeToString(getStreamPipeNode(escapeResult))
  }
  if (isStreamPipeWeb(escapeResult)) {
    return streamPipeWebToString(getStreamPipeWeb(escapeResult))
  }
  checkType<never>(escapeResult)
  assert(false)
}
