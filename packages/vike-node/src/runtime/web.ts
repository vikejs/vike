export { connectToWeb }

import { ServerResponse, type IncomingMessage, type OutgoingHttpHeader, type OutgoingHttpHeaders } from 'node:http'
import type { Socket } from 'node:net'
import { Duplex, PassThrough, Readable } from 'node:stream'
import { assert } from '../utils/assert.js'
import type { ConnectMiddleware } from './types.js'
import { flattenHeaders } from './utils.js'

type WebHandler = (request: Request) => Response | undefined | Promise<Response | undefined>

const CTX = Symbol.for('__connectToWeb')

declare global {
  interface Request {
    [CTX]?: { req: IncomingMessage; res: ResponseWrapper }
  }
}

function connectToWeb(handler: ConnectMiddleware): WebHandler {
  return async (request: Request) => {
    let req: IncomingMessage
    let res: ResponseWrapper
    if (!request[CTX]) {
      req = createIncomingMessage(request)
      res = new ResponseWrapper(req)
      req.socket = Duplex.from({ readable: req, writable: res.socket }) as Socket
      request[CTX] = {
        req,
        res
      }
    } else {
      req = request[CTX].req
      res = request[CTX].res
    }

    return new Promise<Response | undefined>((resolve, reject) => {
      res.resolve = resolve
      const next = (error?: unknown) => {
        if (error) {
          reject(error instanceof Error ? error : new Error(String(error)))
        } else {
          resolve(undefined)
        }
      }

      try {
        handler(req, res, next)
      } catch (error) {
        reject(error instanceof Error ? error : new Error(String(error)))
      }

      request.signal.addEventListener('abort', () => {
        resolve(undefined)
      })
    })
  }
}

function createIncomingMessage(request: Request): IncomingMessage {
  const parsedUrl = new URL(request.url)
  const pathnameAndQuery = (parsedUrl.pathname || '') + (parsedUrl.search || '')

  const body = request.body ? Readable.fromWeb(request.body as any) : Readable.from([])
  return Object.assign(body, {
    url: pathnameAndQuery,
    method: request.method,
    headers: Object.fromEntries(request.headers)
  }) as IncomingMessage
}

class ResponseWrapper extends ServerResponse {
  resolve?: (value: Response | undefined) => void
  private resolved = false

  constructor(req: IncomingMessage) {
    super(req)
    this.assignSocket(new PassThrough() as Duplex as Socket)
    this.once('finish', () => {
      assert(this.socket)
      this.socket.end()
    })
    assert(this.socket)
    this.socket.on('drain', () => {
      this.emit('drain')
    })
  }

  writeHead(
    statusCode: number,
    statusMessage?: string | OutgoingHttpHeaders | OutgoingHttpHeader[] | undefined,
    headers?: OutgoingHttpHeaders | OutgoingHttpHeader[] | undefined
  ) {
    // Don't write the actual headers to the response stream, instead we need to pass them to Response
    // (don't call super.writeHead, because that could send the headers to the response stream)
    this.statusCode = statusCode
    if (typeof statusMessage === 'object') {
      headers = statusMessage
      statusMessage = undefined
    }
    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        if (value !== undefined) {
          this.setHeader(key, value)
        }
      })
    }
    // Send the headers now in the Response
    this.resolveResponse()
    return this
  }

  resolveResponse() {
    if (this.resolved) {
      return
    }
    this.resolved = true
    assert(this.resolve)
    assert(this.socket)
    this.resolve(
      new Response(this.statusCode === 304 ? null : (Readable.toWeb(this.socket) as ReadableStream), {
        status: this.statusCode,
        headers: flattenHeaders(this.getHeaders())
      })
    )
  }

  // Express-compatible methods
  status(code: number): this {
    this.statusCode = code
    return this
  }
  send(body: string | object | Buffer): this {
    this.end(body)
    return this
  }
}
