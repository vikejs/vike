import { describe, it, expect, vi, afterEach } from 'vitest'
import type { ViteDevServer } from 'vite'
import { defineDevMiddleware } from './globalContext.js'

function createGlobalContext(middlewareMode: boolean) {
  const middlewares = vi.fn()
  const viteDevServer = { config: { server: { middlewareMode } }, middlewares } as unknown as ViteDevServer
  const globalContext = { devMiddleware: null as unknown }
  defineDevMiddleware(globalContext, viteDevServer)
  return { globalContext, middlewares }
}

describe('defineDevMiddleware()', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  // Runs first: the warning is shown only once per process
  it("is Vite's middlewares in middleware mode, without a warning", () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { globalContext, middlewares } = createGlobalContext(true)
    expect(globalContext.devMiddleware).toBe(middlewares)
    expect(warn).not.toHaveBeenCalled()
  })

  it("is Vite's middlewares outside middleware mode (e.g. +server.js), and reading it warns once", () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { globalContext, middlewares } = createGlobalContext(false)
    expect({ ...globalContext }).toEqual({})
    expect(warn).not.toHaveBeenCalled()
    expect(globalContext.devMiddleware).toBe(middlewares)
    expect(warn).toHaveBeenCalledTimes(1)
    expect(String(warn.mock.calls[0]![0])).toContain('globalContext.devMiddleware hangs the development server')
    expect(globalContext.devMiddleware).toBe(middlewares)
    expect(warn).toHaveBeenCalledTimes(1)
  })
})
