import Stream from 'stream'
import {EscapeResult} from './escapeInject'

export { streamToString }
export { getNodeStream }
export { getWebStream }
export { pipeToStreamWritableNode }
export { pipeToStreamWritableWeb }

export type { StreamReadableWeb }
export type { StreamReadableNode }
export type { StreamWritableWeb }
export type { StreamWritableNode }
export type { StreamPipeWeb }
export type { StreamPipeNode }

type StreamReadableWeb = ReadableStream
type StreamWritableWeb = WritableStream
type StreamReadableNode = Stream.Readable
type StreamWritableNode = Stream.Writable

type StreamPipeWeb = (writable: StreamWritableWeb) => void
type StreamPipeNode = (writable: StreamWritableNode) => void

async function streamToString(thing: string | StreamReadableNode | StreamReadableWeb | StreamPipeNode | StreamPipeWeb): Promise<string> {
  if (typeof thing === 'string') {
    return thing
  } else if (isWebStream(thing)) {
    return webStreamToString(thing)
  } else if (isNodeStream(thing)) {
    return nodeStreamToString(thing)
  }
  assert(false)
}

function isWebStream(thing: unknown): thing is ReadableStream {
  return thing instanceof ReadableStream
}
function isNodeStream(thing: unknown): thing is Stream.Readable {
  return thing instanceof Stream.Readable
}

async function nodeStreamToString(nodeStream: Stream.Readable): Promise<string> {
  // Copied from: https://stackoverflow.com/questions/10623798/how-do-i-read-the-contents-of-a-node-js-stream-into-a-string-variable/49428486#49428486
  const chunks: Buffer[] = []
  return new Promise((resolve, reject) => {
    nodeStream.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
    nodeStream.on('error', (err) => reject(err))
    nodeStream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
  })
}

async function webStreamToString(webStream: ReadableStream): Promise<string> {
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

function stringToNodeStream(str: string): Stream.Readable {
  return Stream.Readable.from(str)
}

function stringToWebStream(str: string): ReadableStream {
  // `ReadableStream.from()` spec discussion: https://github.com/whatwg/streams/issues/1018
  const readableStream = new ReadableStream({
    start(controller) {
      controller.enqueue(str)
      controller.close()
    }
  })
  return readableStream
}

function getNodeStream(escapeResult: EscapeResult):  null | StreamReadableNode {
      if (typeof escapeResult === 'string') {
        return stringToNodeStream(escapeResult)
      }
  if( isNodeStream(escapeResult) ) {
      return escapeResult
  }
  return null
}
function getWebStream(escapeResult: EscapeResult):  null | StreamReadableWeb {
      if (typeof escapeResult === 'string') {
        return stringToWebStream(escapeResult)
      }
  if( isWebStream(escapeResult) ) {
      return escapeResult
  }
  return null
}

function pipeToStreamWritableWeb(escapeResult: EscapeResult, writable: StreamWritableWeb): boolean {
  
}
function pipeToStreamWritableNode(escapeResult: EscapeResult, writable: StreamWritableNode): boolean {
  
}
