import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const { serverEntryViteServer, createServer } = vi.hoisted(() => ({
  serverEntryViteServer: { current: null as null | {} },
  createServer: vi.fn(async () => ({ middlewares: () => {}, config: {} })),
}))
vi.mock('./api/serverEntryDev.js', () => ({ getServerEntryViteServer: () => serverEntryViteServer.current }))
vi.mock('./api/prepareViteApiCall.js', () => ({ prepareViteApiCall: async () => ({ viteConfigUser: {} }) }))
vi.mock('vite', () => ({ createServer }))

import { createDevMiddleware } from './createDevMiddleware.js'

describe('createDevMiddleware()', () => {
  beforeEach(() => {
    createServer.mockClear()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  // Runs first: the warning is shown only once per process
  it("doesn't warn outside +serverEntry.js", async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    serverEntryViteServer.current = null
    await createDevMiddleware()
    expect(warn).not.toHaveBeenCalled()
    expect(createServer).toHaveBeenCalledTimes(1)
  })

  it('warns once in +serverEntry.js under $ vike dev, and still creates the server', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    serverEntryViteServer.current = {}
    await createDevMiddleware()
    expect(warn).toHaveBeenCalledTimes(1)
    expect(String(warn.mock.calls[0]![0])).toContain(
      "createDevMiddleware() in +serverEntry.js creates a second Vite development server, so HMR won't work",
    )
    expect(createServer).toHaveBeenCalledTimes(1)
    await createDevMiddleware()
    expect(warn).toHaveBeenCalledTimes(1)
    expect(createServer).toHaveBeenCalledTimes(2)
  })
})
