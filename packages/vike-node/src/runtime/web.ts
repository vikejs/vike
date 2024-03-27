export { vike }

import { PassThrough, Readable } from 'stream'
import { parse } from 'url'
import { createHandler } from './handler.js'
import { convertToHttpHeaders, parseHeaders } from './renderAsset.js'
import type { HeadersProvided, VikeOptions } from './types.js'

function vike(
  {
    url,
    headers
  }: {
    url: string
    headers: HeadersProvided
  },
  options?: VikeOptions
) {
  const requestHeaders = convertToHttpHeaders(parseHeaders(headers))
  const handler = createHandler(options)
  const responseHeaders: Record<string, string> = {}
  let responseStatus = 200
  const res = new Proxy(new PassThrough(), {
    get(target, prop) {
      if (prop === 'headers') {
        return responseHeaders
      }
      if (prop === 'statusCode') {
        return responseStatus
      }
      return Reflect.get(target, prop)
    },
    set(target, p, newValue, receiver) {
      if (p === 'statusCode') {
        responseStatus = newValue
      } else {
        return Reflect.set(target, p, newValue, receiver)
      }
      return true
    }
  })
  // @ts-ignore
  res.setHeader = (key: string, value: string) => {
    responseHeaders[key] = value
  }
  // @ts-ignore
  res.getHeader = (key: string) => responseHeaders[key]
  // @ts-ignore
  res.removeHeader = (key: string) => delete responseHeaders[key]
  // @ts-ignore
  res.writeHead = (status_: number, headersOrMessage?: Record<string, string> | string) => {
    responseStatus = status_
    if (typeof headersOrMessage === 'object') {
      Object.assign(responseHeaders, headersOrMessage)
    }
  }

  return new Promise<{ body: ReadableStream | null; status: number; headers: Record<string, string> } | null>(
    (resolve) => {
      let resolved = false
      function resolveResponse() {
        if (resolved) return
        resolved = true
        resolve({
          body: responseStatus === 304 ? null : (Readable.toWeb(res) as ReadableStream),
          status: responseStatus,
          headers: responseHeaders
        })
      }

      const originalWrite = res.write.bind(res)
      res.write = (...args) => {
        resolveResponse()
        // @ts-ignore
        return originalWrite(...args)
      }
      const originalEnd = res.end.bind(res)
      res.end = (...args) => {
        resolveResponse()
        // @ts-ignore
        return originalEnd(...args)
      }
      // @ts-ignore
      res._header = () => {}

      const parsedUrl = parse(url)
      const pathnameAndQuery = (parsedUrl.pathname || '') + (parsedUrl.search || '')
      const req = {
        url: pathnameAndQuery,
        headers: requestHeaders,
        method: 'GET'
      }

      handler({
        // @ts-ignore
        req,
        // @ts-ignore
        res,
        platformRequest: null,
        next: () => {
          resolve(null)
        }
      })
    }
  )
}
