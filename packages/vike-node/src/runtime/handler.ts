export { createHandler }

import type { IncomingMessage, ServerResponse } from 'http'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { renderPage } from 'vike/server'
import { assert } from '../utils/assert.js'
import { getIsDevEnv } from './env.js'
import { RenderAssetHttpResponse, renderAsset } from './renderAsset.js'
import type { NextFunction, VikeHttpResponse, VikeOptions } from './types.js'

const dirname_ = dirname(fileURLToPath(import.meta.url))

function createHandler<PlatformRequest>(options: VikeOptions<PlatformRequest> = {}) {
  let staticHandler: ((req: IncomingMessage, res: ServerResponse, next: () => void) => void) | undefined
  let compressHandler: ((req: IncomingMessage, res: ServerResponse, next: () => void) => void) | undefined

  function getPageContext(platformRequest: PlatformRequest): Record<string, any> | Promise<Record<string, any>> {
    if (typeof options?.pageContext === 'function') {
      return options.pageContext(platformRequest)
    }
    return options.pageContext ?? {}
  }

  const serveAssets =
    options.serveAssets === true || options.serveAssets === undefined
      ? {
          root: join(dirname_, '..', 'client'),
          compress: true,
          cache: true
        }
      : false

  return async function handler({
    req,
    res,
    next,
    platformRequest
  }: {
    req: IncomingMessage
    res: ServerResponse
    next?: NextFunction
    platformRequest: PlatformRequest
  }) {
    if (req.method !== 'GET') {
      return next?.()
    }
    const urlOriginal = req.url ?? ''

    if (getIsDevEnv()) {
      const httpResponse = await renderAsset(urlOriginal, req.headers)

      if (httpResponse) {
        await writeHttpResponse(httpResponse, res)
        return
      }
    } else if (serveAssets) {
      const { root, compress, cache } = serveAssets
      if (compress) {
        if (!compressHandler) {
          const { default: shrinkRay } = await import('@nitedani/shrink-ray-current')
          //@ts-ignore
          compressHandler = shrinkRay({
            cacheSize: cache ? '128mB' : false
          })
        }

        assert(compressHandler)
        compressHandler(req, res, () => {})
      }

      if (!staticHandler) {
        const { default: sirv } = await import('sirv')
        staticHandler = sirv(root, {
          etag: true
        })
      }

      const handled = await new Promise<boolean>((resolve) => {
        res.once('finish', () => resolve(true))
        assert(staticHandler)
        staticHandler(req, res, () => {
          resolve(false)
        })
      })
      if (handled) {
        return
      }
    }

    const pageContextInit = {
      urlOriginal,
      userAgent: req.headers['user-agent']
    }

    const mergedPageContextInit = {
      ...pageContextInit,
      ...(getPageContext && (await getPageContext(platformRequest)))
    }

    const pageContext = await renderPage(mergedPageContextInit)
    const { httpResponse, errorWhileRendering } = pageContext
    if (errorWhileRendering) {
      options.onError?.(errorWhileRendering)
    }
    if (!httpResponse) return next?.()
    await writeHttpResponse(httpResponse, res)
  }
}

async function writeHttpResponse(httpResponse: VikeHttpResponse | RenderAssetHttpResponse, res: ServerResponse) {
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

function groupHeaders(headers: [string, string][]) {
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
