import { describe, it, expect, vi } from 'vitest'
import { enhance, getUniversal, getUniversalProp, methodSymbol, type RuntimeAdapter } from '@universal-middleware/core'

let plusMiddlewares: unknown[] = []
vi.mock('./globalContext.js', () => ({
  getGlobalContextServerInternal: async () => ({
    globalContext: { config: { middleware: plusMiddlewares }, baseServer: '/' },
  }),
}))
// The page renders its url and the context it got
vi.mock('./renderPageServer.js', () => ({
  renderPageServerConfigError: async () => null,
  renderPageServer: async (pageContextInit: { urlOriginal: string; fromOther?: string }) => ({
    httpResponse: {
      statusCode: 200,
      headers: [],
      getReadableWebStream: () =>
        new Response(`page ${new URL(pageContextInit.urlOriginal).pathname} ${pageContextInit.fromOther}`).body,
    },
  }),
}))
const { default: universalVikeHandler } = await import('./universal-middleware.js')
const { pageMethods } = await import('./pagesHandler.js')

const runtime = {} as RuntimeAdapter
const call = async (url: string) =>
  (await getUniversal(universalVikeHandler)(new Request(`http://localhost${url}`), {}, runtime)) as Response

describe('universal-middleware (what the released adapters apply)', () => {
  it('renders the page when there are no +middleware', async () => {
    plusMiddlewares = []
    expect(await (await call('/a')).text()).toBe('page /a undefined')
  })

  it('gives the page the context of a +middleware, and applies its response handler', async () => {
    plusMiddlewares = [
      enhance(() => ({ fromOther: 'yes' }), { name: 'context' }),
      enhance(() => (response: Response) => (response.headers.set('x-seen', 'yes'), response), { name: 'header' }),
    ]
    const response = await call('/a')
    expect(await response.text()).toBe('page /a yes')
    expect(response.headers.get('x-seen')).toBe('yes')
  })

  it('answers with a +middleware that is a handler instead of the page', async () => {
    plusMiddlewares = [enhance(() => new Response('from handler'), { name: 'handler', method: 'GET', path: '/a' })]
    expect(await (await call('/a')).text()).toBe('from handler')
    expect(await (await call('/b')).text()).toBe('page /b undefined')
  })

  it('answers with a +middleware that is not a handler before the page and the handlers', async () => {
    plusMiddlewares = [
      enhance(() => new Response('denied', { status: 401 }), { name: 'guard' }),
      enhance(() => new Response('from handler'), { name: 'handler', method: 'GET', path: '/a' }),
    ]
    const response = await call('/a')
    expect(response.status).toBe(401)
    expect(await response.text()).toBe('denied')
  })

  it("declares the methods of the pages only, so that a server's route for another method isn't answered", () => {
    expect(getUniversalProp(universalVikeHandler, methodSymbol)).toEqual(pageMethods)
    expect(pageMethods).not.toContain('DELETE')
  })
})
