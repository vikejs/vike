export { createServerResponse }

import { ServerResponse, type IncomingMessage, type OutgoingHttpHeader, type OutgoingHttpHeaders } from 'http'
import { PassThrough } from 'stream'

function createServerResponse(incomingMessage: IncomingMessage) {
  const res = new ServerResponse(incomingMessage)
  const passThrough = new PassThrough()

  const onReadable = new Promise<{ readable: PassThrough; headers: OutgoingHttpHeaders; statusCode: number }>(
    (resolve) => {
      passThrough.once('readable', () => {
        resolve({ readable: passThrough, headers: res.getHeaders(), statusCode: res.statusCode })
      })
    }
  )

  res.write = passThrough.write.bind(passThrough)
  res.end = passThrough.end.bind(passThrough) as any
  res.once('finish', () => {
    passThrough.end()
  })
  passThrough.on('drain', () => {
    res.emit('drain')
  })

  let sent = false
  res.writeHead = function writeHead(
    statusCode: number,
    statusMessage?: string | OutgoingHttpHeaders | OutgoingHttpHeader[] | undefined,
    headers?: OutgoingHttpHeaders | OutgoingHttpHeader[] | undefined
  ) {
    if (sent) {
      return res
    }
    sent = true
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
