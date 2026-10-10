import { describe, it, expect, vi } from 'vitest'
import { enhance } from '@universal-middleware/core'

let plusMiddlewares: unknown[] = []
vi.mock('./globalContext.js', () => ({
  getGlobalContextServerInternal: async () => ({
    globalContext: { config: { middleware: plusMiddlewares }, baseServer: '/' },
  }),
  // A production server: the global context is loaded
  getGlobalContextServerInternalOptional: () => ({
    _isProduction: true,
    config: { middleware: plusMiddlewares },
    baseServer: '/',
  }),
}))
vi.mock('./renderPageServer.js', () => ({
  renderPageServerConfigError: async () => null,
  renderPageServer: async (pageContextInit: { urlOriginal: string }) => ({
    httpResponse: {
      statusCode: 200,
      headers: [],
      getReadableWebStream: () => new Response(`page ${new URL(pageContextInit.urlOriginal).pathname}`).body,
    },
  }),
}))
const { default: server } = await import('./fetch.js')

const call = (url: string, method = 'GET') => server.fetch(new Request(`http://localhost${url}`, { method }))

// `vike/fetch` is the whole server: the +middleware, then Vike's pages
describe('vike/fetch', () => {
  it('renders the page when there are no +middleware', async () => {
    plusMiddlewares = []
    expect(await (await call('/a')).text()).toBe('page /a')
  })

  it('runs the +middleware: the ones that are not handlers, then the handlers, then the pages', async () => {
    plusMiddlewares = [
      enhance(
        (request: Request) =>
          new URL(request.url).pathname === '/denied' ? new Response('denied', { status: 401 }) : undefined,
        {
          name: 'guard',
        },
      ),
      enhance(() => new Response('from handler'), { name: 'handler', method: 'GET', path: '/handler' }),
    ]
    const denied = await call('/denied')
    expect([denied.status, await denied.text()]).toEqual([401, 'denied'])
    expect(await (await call('/handler')).text()).toBe('from handler')
    expect(await (await call('/b')).text()).toBe('page /b')
  })

  it("answers 404 to a method the pages don't serve", async () => {
    plusMiddlewares = []
    const response = await call('/a', 'DELETE')
    expect([response.status, await response.text()]).toEqual([404, 'Not Found'])
  })
})
