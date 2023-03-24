export { addSsrMiddleware }

import { renderPage } from '../../runtime/renderPage'
import type { OnRenderResult } from '../../runtime/renderPage/onRenderResult'
import type { ViteDevServer } from 'vite'
import pc from 'picocolors'
import { assert, projectInfo } from '../utils'

type ConnectServer = ViteDevServer['middlewares']
let isErrorPrevious: undefined | boolean

function addSsrMiddleware(middlewares: ConnectServer, viteDevServer: null | ViteDevServer) {
  middlewares.use(async (req, res, next) => {
    if (res.headersSent) return next()
    const url = req.originalUrl || req.url
    if (!url) return next()
    const userAgent = req.headers['user-agent']
    const onRenderResult: OnRenderResult = (isError, statusCode) => {
      onRenderResultCallback(isError, statusCode, url, viteDevServer)
    }
    const pageContextInit = {
      urlOriginal: url,
      userAgent,
      _onRenderResult: onRenderResult
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

function onRenderResultCallback(
  isError: boolean,
  statusCode: 200 | 404 | null,
  url: string,
  viteDevServer: null | ViteDevServer
) {
  if (!viteDevServer) return
  assert(typeof isError === 'boolean')
  assert(statusCode === null || statusCode === 200 || statusCode === 404)
  const color = (s: number | string) => pc.bold(isError ? pc.red(s) : pc.green(s))
  const msg = [pc.green('HTTP Request'), color(statusCode || 'ERR'), pc.gray(url)].join(' ')
  const clear = isError || isErrorPrevious === true
  isErrorPrevious = isError
  log(msg, viteDevServer, clear)
}

// Copied and adapted from https://github.com/vitejs/vite/blob/9adb2a3a29e26302647092d783ea78cff6ca3473/packages/vite/src/node/logger.ts
function log(msg: string, viteDevServer: ViteDevServer, clear: boolean) {
  const tag = pc.cyan(pc.bold(`[${projectInfo.projectName}]`))
  // Workaround for Vite not respecting the clear option: https://github.com/vitejs/vite/blob/02a46d7ceab71ebf7ba723372ba37012b7f9ccaf/packages/vite/src/node/logger.ts#L91
  if (!clear) msg = msg + getStringIsEqualBuster()
  viteDevServer.config.logger.info(`${pc.dim(new Date().toLocaleTimeString())} ${tag} ${msg}`, { clear })
}

function getStringIsEqualBuster() {
  if (!process.stdout.isTTY || process.env.CI) {
    // Workaround isn't needed: https://github.com/vitejs/vite/blob/02a46d7ceab71ebf7ba723372ba37012b7f9ccaf/packages/vite/src/node/logger.ts#L65-L66
    return ''
  }
  const zeroWidthSpace = '\u200b'
  const stringIsEqualBuster = zeroWidthSpace.repeat(Math.ceil(Math.random() * 1000))
  return stringIsEqualBuster
}
