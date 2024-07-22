export { connectToWeb }

import { ServerResponse, type IncomingMessage } from 'node:http'
import type { Socket } from 'node:net'
import { Duplex, PassThrough, Readable } from 'node:stream'
import { ConnectMiddleware } from './types.js'

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
    const passThrough = new PassThrough()
    this.assignSocket(passThrough as any as Socket)
    this.once('end', passThrough.end.bind(passThrough))
  }

  write(chunk: any, encoding?: any, callback?: any) {
    super.write(chunk, encoding, callback)
    setTimeout(() => {
      this.resolveResponse()
    }, 0)
    return true
  }

  writeHead() {
    setTimeout(() => {
      this.resolveResponse()
    }, 0)
    return this
  }

  end(chunk?: any, encoding?: any, cb?: any) {
    super.end(chunk, encoding, cb)
    this.emit('end')
    return this
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

  resolveResponse() {
    if (this.resolved) {
      return
    }
    this.resolved = true
    this.resolve!(
      new Response(this.statusCode === 304 ? null : (Readable.toWeb(this.socket!) as ReadableStream), {
        status: this.statusCode,
        headers: this.getHeaders() as HeadersInit
      })
    )
  }
}
