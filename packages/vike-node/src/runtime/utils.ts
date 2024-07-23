export { flattenHeaders, groupHeaders, createServerResponse, writeHttpResponse }

import { ServerResponse, type IncomingMessage, type OutgoingHttpHeader, type OutgoingHttpHeaders } from 'http'
import { PassThrough } from 'stream'
import { assert } from '../utils/assert.js'
import type { VikeHttpResponse } from './types.js'

async function writeHttpResponse(httpResponse: VikeHttpResponse, res: ServerResponse) {
  assert(httpResponse)
  const { statusCode, headers } = httpResponse
  const groupedHeaders = groupHeaders(headers)
  groupedHeaders.forEach(([name, value]) => res.setHeader(name, value))
  res.statusCode = statusCode
  httpResponse.pipe(res)
  await new Promise<void>((resolve) => {
    res.once('finish', resolve)
  })
}

function groupHeaders(headers: [string, string][]): [string, string | string[]][] {
  const grouped: { [key: string]: string | string[] } = {}

  headers.forEach(([key, value]) => {
    if (grouped[key]) {
      // If the key already exists, append the new value
      if (Array.isArray(grouped[key])) {
        ;(grouped[key] as string[]).push(value)
      } else {
        grouped[key] = [grouped[key] as string, value]
      }
    } else {
      // If the key doesn't exist, add it to the object
      grouped[key] = value
    }
  })

  // Convert the object back to an array
  return Object.entries(grouped)
}

function flattenHeaders(headers: OutgoingHttpHeaders): [string, string][] {
  const flatHeaders: [string, string][] = []

  for (const [key, value] of Object.entries(headers)) {
    if (value === undefined || value === null) {
      continue
    }

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v != null) {
          flatHeaders.push([key, String(v)])
        }
      })
    } else {
      flatHeaders.push([key, String(value)])
    }
  }

  return flatHeaders
}

// Solves the following issue:
// https://fastify.dev/docs/latest/Reference/Reply/#raw
function createServerResponse(
  incomingMessage: IncomingMessage,
  onReadable: (result: { readable: PassThrough; headers: OutgoingHttpHeaders; statusCode: number }) => void
) {
  const serverResponse = new ServerResponse(incomingMessage)
  const passThrough = new PassThrough()

  passThrough.once('readable', () => {
    serverResponse.writeHead(serverResponse.statusCode)
    onReadable({ readable: passThrough, headers: serverResponse.getHeaders(), statusCode: serverResponse.statusCode })
  })

  serverResponse.write = passThrough.write.bind(passThrough)
  serverResponse.end = passThrough.end.bind(passThrough) as any
  serverResponse.once('finish', () => {
    passThrough.end()
  })
  passThrough.on('drain', () => {
    serverResponse.emit('drain')
  })

  let sent = false
  serverResponse.writeHead = function writeHead(
    statusCode: number,
    statusMessage?: string | OutgoingHttpHeaders | OutgoingHttpHeader[] | undefined,
    headers?: OutgoingHttpHeaders | OutgoingHttpHeader[] | undefined
  ) {
    if (sent) {
      return serverResponse
    }
    sent = true
    serverResponse.statusCode = statusCode
    if (typeof statusMessage === 'object') {
      headers = statusMessage
      statusMessage = undefined
    }

    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        if (value !== undefined) {
          serverResponse.setHeader(key, value)
        }
      })
    }

    return serverResponse
  }

  return serverResponse
}
