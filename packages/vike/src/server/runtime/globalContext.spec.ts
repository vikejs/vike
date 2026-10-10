import { describe, it, expect, vi, afterEach } from 'vitest'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { ViteDevServer } from 'vite'
import { getDevMiddleware } from './globalContext.js'

function createViteDevServer(middlewareMode: boolean) {
  const middlewares = vi.fn()
  const viteDevServer = { config: { server: { middlewareMode } }, middlewares } as unknown as ViteDevServer
  return { viteDevServer, middlewares }
}
const req = {} as IncomingMessage
const res = {} as ServerResponse

describe('getDevMiddleware()', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  // Runs first: the warning is shown only once per process
  it("returns Vite's middlewares in middleware mode, without a warning", () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { viteDevServer, middlewares } = createViteDevServer(true)
    const devMiddleware = getDevMiddleware(viteDevServer)
    expect(devMiddleware).toBe(middlewares)
    devMiddleware(req, res, () => {})
    expect(warn).not.toHaveBeenCalled()
  })

  it("warns once outside middleware mode (e.g. +server.js), then runs Vite's middlewares", () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { viteDevServer, middlewares } = createViteDevServer(false)
    const devMiddleware = getDevMiddleware(viteDevServer)
    const next = () => {}
    devMiddleware(req, res, next)
    expect(warn).toHaveBeenCalledTimes(1)
    expect(String(warn.mock.calls[0]![0])).toContain('globalContext.devMiddleware hangs the development server')
    expect(middlewares).toHaveBeenCalledWith(req, res, next)
    devMiddleware(req, res, next)
    expect(warn).toHaveBeenCalledTimes(1)
    expect(middlewares).toHaveBeenCalledTimes(2)
  })
})
