import { IncomingMessage, ServerResponse } from 'http'
import { dirname, isAbsolute, join } from 'path'
import { fileURLToPath } from 'url'
import { renderPage } from 'vike/server'
import { assert } from '../utils/assert.js'
import { getIsPluginLoaded, store } from './env.js'
import type { ConnectMiddleware, NextFunction, VikeOptions } from './types.js'
import { writeHttpResponse } from './utils.js'

const argv1 = process.argv[1]
const entrypointDirAbs = argv1
  ? dirname(isAbsolute(argv1) ? argv1 : join(process.cwd(), argv1))
  : dirname(fileURLToPath(import.meta.url))

export function createHandler<PlatformRequest>(options: VikeOptions<PlatformRequest> = {}) {
  let staticMiddleware: ConnectMiddleware | undefined
  let compressMiddleware: ConnectMiddleware | undefined

  const getPageContext = (platformRequest: PlatformRequest) =>
    typeof options.pageContext === 'function' ? options.pageContext(platformRequest) : options.pageContext ?? {}

  const serveAssets =
    options.serveAssets === true || options.serveAssets === undefined
      ? { root: join(entrypointDirAbs, '..', 'client'), compress: true, cache: true }
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
    if (req.method !== 'GET') return next?.()

    const urlOriginal = req.url ?? ''

    if (getIsPluginLoaded()) {
      const handled = await handleViteDevServer(req, res)
      if (handled) return
    } else if (serveAssets) {
      const handled = await handleAssets(req, res, serveAssets)
      if (handled) return
    }

    const pageContext = await renderPage({
      urlOriginal,
      userAgent: req.headers['user-agent'],
      ...(await getPageContext(platformRequest))
    })

    if (pageContext.errorWhileRendering) {
      options.onError?.(pageContext.errorWhileRendering)
    }

    if (!pageContext.httpResponse) return next?.()
    await writeHttpResponse(pageContext.httpResponse, res)
  }

  function handleViteDevServer(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      res.once('finish', () => resolve(true))
      assert(store.viteDevServer)
      store.viteDevServer.middlewares(req, res, () => resolve(false))
    })
  }

  async function handleAssets(
    req: IncomingMessage,
    res: ServerResponse,
    assets: { root: string; compress: boolean; cache: boolean }
  ): Promise<boolean> {
    if (assets.compress && !compressMiddleware) {
      const { default: shrinkRay } = await import('@nitedani/shrink-ray-current')
      compressMiddleware = shrinkRay({ cacheSize: assets.cache ? '128mB' : false }) as ConnectMiddleware
    }

    if (!staticMiddleware) {
      const { default: sirv } = await import('sirv')
      staticMiddleware = sirv(assets.root, { etag: true })
    }

    return new Promise<boolean>((resolve) => {
      res.once('finish', () => resolve(true))
      if (assets.compress) compressMiddleware!(req, res, () => {})
      staticMiddleware!(req, res, () => resolve(false))
    })
  }
}
