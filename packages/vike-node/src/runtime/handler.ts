import type { IncomingMessage, ServerResponse } from 'http'
import { dirname, isAbsolute, join } from 'path'
import { fileURLToPath } from 'url'
import { renderPage } from 'vike/server'
import { assert } from '../utils/assert.js'
import { globalStore } from './globalStore.js'
import type { ConnectMiddleware, VikeOptions } from './types.js'
import { writeHttpResponse } from './utils/writeHttpResponse.js'

const argv1 = process.argv[1]
const entrypointDirAbs = argv1
  ? dirname(isAbsolute(argv1) ? argv1 : join(process.cwd(), argv1))
  : dirname(fileURLToPath(import.meta.url))
const defaultStaticDir = join(entrypointDirAbs, '..', 'client')

export function createHandler<PlatformRequest>(options: VikeOptions<PlatformRequest> = {}) {
  const staticConfig = resolveStaticConfig(options.static)
  const shouldCache = staticConfig && staticConfig.cache
  const compressionType = options.compress ?? true
  let staticMiddleware: ConnectMiddleware | undefined
  let compressMiddleware: ConnectMiddleware | undefined

  return async function handler({
    req,
    res,
    next,
    platformRequest
  }: {
    req: IncomingMessage
    res: ServerResponse
    next?: (err?: unknown) => void
    platformRequest: PlatformRequest
  }): Promise<boolean> {
    if (req.method !== 'GET') {
      next?.()
      return false
    }

    if (globalStore.isPluginLoaded) {
      const handled = await handleViteDevServer(req, res)
      if (handled) return true
    } else {
      const isAsset = req.url?.startsWith('/assets/')
      const shouldCompressResponse = compressionType === true || (compressionType === 'static' && isAsset)
      if (shouldCompressResponse) {
        await applyCompression(req, res, shouldCache)
      }

      if (staticConfig) {
        const handled = await serveStaticFiles(req, res, staticConfig)
        if (handled) return true
      }
    }

    const handled = await renderPageAndRespond(req, res, platformRequest)
    if (handled) return true
    next?.()
    return false
  }

  async function applyCompression(req: IncomingMessage, res: ServerResponse, shouldCache: boolean) {
    if (!compressMiddleware) {
      const { default: shrinkRay } = await import('@nitedani/shrink-ray-current')
      compressMiddleware = shrinkRay({ cacheSize: shouldCache ? '128mB' : false }) as ConnectMiddleware
    }
    compressMiddleware(req, res, () => {})
  }

  async function serveStaticFiles(
    req: IncomingMessage,
    res: ServerResponse,
    config: { root: string; cache: boolean }
  ): Promise<boolean> {
    if (!staticMiddleware) {
      const { default: sirv } = await import('sirv')
      staticMiddleware = sirv(config.root, { etag: true })
    }

    return new Promise<boolean>((resolve) => {
      res.once('finish', () => resolve(true))
      staticMiddleware!(req, res, () => resolve(false))
    })
  }

  async function renderPageAndRespond(
    req: IncomingMessage,
    res: ServerResponse,
    platformRequest: PlatformRequest
  ): Promise<boolean> {
    const pageContext = await renderPage({
      urlOriginal: req.url ?? '',
      userAgent: req.headers['user-agent'],
      ...(await getPageContext(platformRequest))
    })

    if (pageContext.errorWhileRendering) {
      options.onError?.(pageContext.errorWhileRendering)
    }

    if (!pageContext.httpResponse) {
      return false
    }

    await writeHttpResponse(pageContext.httpResponse, res)
    return true
  }

  function getPageContext(platformRequest: PlatformRequest) {
    return typeof options.pageContext === 'function' ? options.pageContext(platformRequest) : options.pageContext ?? {}
  }
}

function handleViteDevServer(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    res.once('finish', () => resolve(true))
    assert(globalStore.viteDevServer)
    globalStore.viteDevServer.middlewares(req, res, () => resolve(false))
  })
}

function resolveStaticConfig(static_: VikeOptions['static']): false | { root: string; cache: boolean } {
  if (static_ === false) return false
  if (static_ === true || static_ === undefined) {
    return { root: defaultStaticDir, cache: true }
  }
  if (typeof static_ === 'string') {
    return { root: static_, cache: true }
  }
  return {
    root: static_.root ?? defaultStaticDir,
    cache: static_.cache ?? true
  }
}
