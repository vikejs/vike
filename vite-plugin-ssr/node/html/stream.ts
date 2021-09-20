import { Readable, Writable } from 'stream'
import { EscapeResult, getStreamPipeWeb, getStreamPipeNode } from './escapeInject'

export { getNodeStream }
export { getWebStream }
export { pipeToStreamWritableNode }
export { pipeToStreamWritableWeb }
export { isStreamReadableWeb }
export { isStreamReadableNode }

export { streamReadableNodeToString }
export { streamReadableWebToString }

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
  return thing instanceof ReadableStream
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

function stringToStreamReadableNode(str: string): Readable {
  return Readable.from(str)
}

function stringToStreamReadableWeb(str: string): ReadableStream {
  // `ReadableStream.from()` spec discussion: https://github.com/whatwg/streams/issues/1018
  const readableStream = new ReadableStream({
    start(controller) {
      controller.enqueue(str)
      controller.close()
    }
  })
  return readableStream
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
  const streamPipeWeb = getStreamPipeWeb(escapeResult)
  if (streamPipeWeb === null) {
    return false
  }
  streamPipeWeb(writable)
  return true
}
function pipeToStreamWritableNode(escapeResult: EscapeResult, writable: StreamWritableNode): boolean {
  const streamPipeNode = getStreamPipeNode(escapeResult)
  if (streamPipeNode === null) {
    return false
  }
  streamPipeNode(writable)
  return true
}
