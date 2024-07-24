export { createServerResponse }

import { ServerResponse, type IncomingMessage, type OutgoingHttpHeader, type OutgoingHttpHeaders } from 'http'
import { Socket } from 'net'
import { Duplex, PassThrough } from 'stream'

/**
 * Creates a custom ServerResponse object that allows for intercepting and streaming the response.
 *
 * @param {IncomingMessage} incomingMessage - The incoming HTTP request message.
 * @returns {{ res: ServerResponse; onReadable: Promise<{ readable: PassThrough; headers: OutgoingHttpHeaders; statusCode: number }> }}
 * An object containing:
 *   - res: The custom ServerResponse object.
 *   - onReadable: A promise that resolves when the response is readable, providing the readable stream, headers, and status code.
 */
function createServerResponse(incomingMessage: IncomingMessage) {
  const res = new ServerResponse(incomingMessage)
  const passThrough = new PassThrough()
  // Adds compatibility for downstream websocket handlers (res.socket)
  const socket = Duplex.from({
    readable: incomingMessage,
    writable: passThrough
  })
  res.assignSocket(socket as Socket)
  const onReadable = new Promise<{ readable: PassThrough; headers: OutgoingHttpHeaders; statusCode: number }>(
    (resolve, reject) => {
      passThrough.once('readable', () => {
        resolve({ readable: passThrough, headers: res.getHeaders(), statusCode: res.statusCode })
      })
      passThrough.once('error', (err) => {
        reject(err)
      })
    }
  )

  res.once('finish', () => {
    passThrough.end()
  })

  passThrough.on('drain', () => {
    res.emit('drain')
  })

  res.write = passThrough.write.bind(passThrough)
  res.end = (passThrough as any).end.bind(passThrough)

  let headersSet = false
  res.writeHead = function writeHead(
    statusCode: number,
    statusMessage?: string | OutgoingHttpHeaders | OutgoingHttpHeader[],
    headers?: OutgoingHttpHeaders | OutgoingHttpHeader[]
  ): ServerResponse {
    if (headersSet) {
      return res
    }
    headersSet = true
    res.statusCode = statusCode
    if (typeof statusMessage === 'object') {
      headers = statusMessage
      statusMessage = undefined
    }
    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        if (value !== undefined) {
          res.setHeader(key, value)
        }
      })
    }
    return res
  }

  return {
    res,
    onReadable
  }
}
