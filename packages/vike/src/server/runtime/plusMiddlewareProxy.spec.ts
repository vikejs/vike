import { describe, it, expect, vi } from 'vitest'
import { enhance, getUniversal, getUniversalProp, methodSymbol, type RuntimeAdapter } from '@universal-middleware/core'

let plusMiddlewares: unknown[] = []
vi.mock('./globalContext.js', () => ({
  getGlobalContextServerInternal: async () => ({
    globalContext: { config: { middleware: plusMiddlewares }, baseServer: '/' },
  }),
  getGlobalContextServerInternalOptional: () => null,
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
const { addMiddlewares, httpMethods, plusMiddlewareProxy } = await import('./plusMiddlewares.js')
// What the adapters' vike(app) applies after the routes of the app
const withPages = plusMiddlewareProxy.find((middleware) => middleware.isHandler)!

const runtime = {} as RuntimeAdapter
const render = async (url: string, context: Universal.Context = {}, method = 'GET') =>
  (await getUniversal(withPages)(new Request(`http://localhost${url}`, { method }), context, runtime)) as Response

describe('plusMiddlewareProxy, with the pages', () => {
  // Must be the first: nothing has applied the +middleware yet
  it('throws if there are +middleware and globalContext.middlewares was not read', async () => {
    plusMiddlewares = [enhance(() => new Response('handler'), { name: 'handler', method: 'GET', path: '/a' })]
    await expect(render('/a')).rejects.toThrow("Your +middleware aren't applied")
  })

  it('runs a +middleware that is a handler before the page, and falls through to the page', async () => {
    // Reading the list applies the +middleware
    addMiddlewares({}, { middleware: [] }).middlewares
    plusMiddlewares = [
      enhance(() => new Response('from handler'), { name: 'path', method: 'GET', path: '/a' }),
      enhance(() => new Response('from order zero'), { name: 'zero', method: 'GET', path: '/b', order: 0 }),
    ]
    expect(await (await render('/a')).text()).toBe('from handler')
    expect(await (await render('/b')).text()).toBe('from order zero')
    expect(await (await render('/c')).text()).toBe('page /c undefined')
  })

  it("falls through to the page when a handler doesn't answer", async () => {
    plusMiddlewares = [enhance(() => undefined, { name: 'passes', method: 'GET', path: '/a' })]
    expect(await (await render('/a')).text()).toBe('page /a undefined')
  })

  it('does not run the +middleware that are not handlers', async () => {
    plusMiddlewares = [enhance(() => new Response('other'), { name: 'other' })]
    expect(await (await render('/')).text()).toBe('page / undefined')
  })

  it('gives the page and the handlers the context of the +middleware that are not handlers', async () => {
    let seen: unknown
    plusMiddlewares = [
      enhance(
        (_request: Request, context: Universal.Context) => {
          seen = (context as { fromOther?: string }).fromOther
        },
        { name: 'handler', method: 'GET', path: '/a' },
      ),
    ]
    expect(await (await render('/a', { fromOther: 'yes' })).text()).toBe('page /a yes')
    expect(seen).toBe('yes')
  })

  it('adds the context of a handler for the page', async () => {
    plusMiddlewares = [enhance(() => ({ fromOther: 'handler' }), { name: 'handler', method: 'GET', path: '/a' })]
    expect(await (await render('/a')).text()).toBe('page /a handler')
  })

  it('declares every HTTP method, for servers to install it on', () => {
    const methods = getUniversalProp(withPages, methodSymbol)
    expect(methods).toEqual(httpMethods)
    expect(methods).toContain('DELETE')
  })

  it('runs a +middleware that is a handler on DELETE', async () => {
    plusMiddlewares = [enhance(() => new Response('deleted'), { name: 'delete', method: 'DELETE', path: '/a' })]
    expect(await (await render('/a', {}, 'DELETE')).text()).toBe('deleted')
  })

  it("answers 404, like a server without a route, to a method the pages don't serve and no handler answers", async () => {
    plusMiddlewares = [enhance(() => new Response('deleted'), { name: 'delete', method: 'DELETE', path: '/a' })]
    expect((await render('/b', {}, 'DELETE')).status).toBe(404)
    expect((await render('/b', {}, 'POST')).status).toBe(200)
  })
})
