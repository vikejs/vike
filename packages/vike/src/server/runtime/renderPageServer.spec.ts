import { describe, it, expect, vi } from 'vitest'

// renderPageServer() reaches the check on the first lines of rendering; the rest of its imports aren't run
let middleware: unknown[] = []
vi.mock('./globalContext.js', () => ({
  initGlobalContext_renderPage: async () => {},
  getGlobalContextServerInternal: async () => ({ globalContext: { config: { middleware } } }),
}))
vi.mock('../../shared-server-node/getVikeConfigError.js', () => ({ getVikeConfigError: () => null }))
const { renderPageServer } = await import('./renderPageServer.js')

describe('renderPageServer()', () => {
  it("throws to its caller if there are +middleware and nothing applied them, since it doesn't run them", async () => {
    middleware = [[() => undefined]]
    await expect(renderPageServer({ urlOriginal: '/' })).rejects.toThrow("Your +middleware aren't applied")
  })
})
