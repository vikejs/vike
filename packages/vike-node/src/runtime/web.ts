export { connectToWeb }

import type { IncomingMessage, ServerResponse } from 'node:http'
import { Readable } from 'node:stream'
import { createServerResponse } from './createServerResponse.js'
import type { ConnectMiddleware } from './types.js'
import { flattenHeaders } from './utils.js'

type WebHandler = (request: Request) => Response | undefined | Promise<Response | undefined>

const CTX = Symbol.for('__connectToWeb')

declare global {
  interface Request {
    [CTX]?: { req: IncomingMessage; res: ServerResponse }
  }
}

function connectToWeb(handler: ConnectMiddleware): WebHandler {
  return async (request: Request) => {
    const req = createIncomingMessage(request)
    const { res, onReadable } = createServerResponse(req)

    return new Promise<Response | undefined>((resolve, reject) => {
      ;(async () => {
        const { readable, headers, statusCode } = await onReadable
        resolve(
          new Response(statusCode === 304 ? null : (Readable.toWeb(readable) as ReadableStream), {
            status: statusCode,
            headers: flattenHeaders(headers)
          })
        )
      })()

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
