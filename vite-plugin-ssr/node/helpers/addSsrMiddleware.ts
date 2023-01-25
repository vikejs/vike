export { addSsrMiddleware }

import { renderPage } from '../runtime/renderPage'
import type { ViteDevServer } from 'vite'
import pc from 'picocolors'
import { assert, projectInfo } from '../utils'

type ConnectServer = ViteDevServer['middlewares']

function addSsrMiddleware(middlewares: ConnectServer, viteDevServer: null | ViteDevServer) {
  middlewares.use(async (req, res, next) => {
    if (res.headersSent) return next()
    const url = req.originalUrl || req.url
    if (!url) return next()
    const userAgent = req.headers['user-agent']
    const pageContextInit = {
      urlOriginal: url,
      userAgent,
      _onRenderResult(isError: unknown, statusCode: unknown) {
        onRenderResult(isError, statusCode, url, viteDevServer)
      }
    }
    let pageContext: Awaited<ReturnType<typeof renderPage>>
    try {
      pageContext = await renderPage(pageContextInit)
    } catch (err) {
      // Throwing an error in a connect middleware shut downs the server
      console.error(err)
      // - next(err) automatically uses buildErrorMessage() (pretty formatting of Rollup errors)
      //   - But it only works for users using Vite's standalone dev server (it doesn't work for users using Vite's dev middleware)
      // - We purposely don't use next(err) to align behavior: we use our own/copied implementation of buildErrorMessage() regardless of whether the user uses Vite's dev middleware or Vite's standalone dev server
      return next()
    }
    if (!pageContext.httpResponse) return next()

    const { statusCode, contentType } = pageContext.httpResponse
    res.setHeader('Content-Type', contentType)
    res.statusCode = statusCode
    pageContext.httpResponse.pipe(res)
  })
}

function onRenderResult(isError: unknown, statusCode: unknown, url: string, viteDevServer: null | ViteDevServer): void {
  if (!viteDevServer) return
  assert(typeof isError === 'boolean')
  assert(statusCode === null || statusCode === 200 || statusCode === 404)
  const color = (s: number | string) => pc.bold(isError ? pc.red(s) : pc.green(s))
  const msg = [pc.green('HTTP Request'), color(statusCode || 'ERR'), pc.gray(url)].join(' ')
  log(msg, viteDevServer)
}

// Copied and adapted from https://github.com/vitejs/vite/blob/9adb2a3a29e26302647092d783ea78cff6ca3473/packages/vite/src/node/logger.ts
function log(msg: string, viteDevServer: ViteDevServer) {
  const tag = pc.cyan(pc.bold(`[${projectInfo.projectName}]`))
  viteDevServer.config.logger.info(`${pc.dim(new Date().toLocaleTimeString())} ${tag} ${msg}`, { clear: true })
}
