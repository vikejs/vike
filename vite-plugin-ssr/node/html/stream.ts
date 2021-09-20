import { Readable, Writable } from 'stream'
import { assert } from '../../shared/utils'
import { EscapeResult, getStreamPipeWeb, getStreamPipeNode } from './escapeInject'

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

export type { StreamReadableWeb }
export type { StreamReadableNode }
export type { StreamWritableWeb }
export type { StreamWritableNode }
export type { StreamPipeWeb }
export type { StreamPipeNode }

type StreamReadableWeb = ReadableStream
type StreamWritableWeb = WritableStream
type StreamReadableNode = Readable
type StreamWritableNode = Writable

type StreamPipeWeb = (writable: StreamWritableWeb) => void
type StreamPipeNode = (writable: StreamWritableNode) => void

function isStreamReadableWeb(thing: unknown): thing is StreamReadableWeb {
  return typeof ReadableStream !== "undefined" && thing instanceof ReadableStream
}
function isStreamReadableNode(thing: unknown): thing is StreamReadableNode {
  return thing instanceof Readable
}

async function streamReadableNodeToString(nodeStream: Readable): Promise<string> {
  // Copied from: https://stackoverflow.com/questions/10623798/how-do-i-read-the-contents-of-a-node-js-stream-into-a-string-variable/49428486#49428486
  const chunks: Buffer[] = []
  return new Promise((resolve, reject) => {
    nodeStream.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
    nodeStream.on('error', (err) => reject(err))
    nodeStream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
  })
}

async function streamReadableWebToString(webStream: ReadableStream): Promise<string> {
  let str: string = ''
  const reader = webStream.getReader()
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
