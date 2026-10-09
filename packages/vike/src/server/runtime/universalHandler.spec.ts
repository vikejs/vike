import { describe, it, expect, vi } from 'vitest'
import { enhance, getUniversal, type RuntimeAdapter } from '@universal-middleware/core'

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
const { getUniversalMiddlewares } = await import('./getUniversalMiddlewares.js')
const { default: universalHandler } = await import('./universalHandler.js')

const runtime = {} as RuntimeAdapter
const render = async (url: string, context: Universal.Context = {}) =>
  (await getUniversal(universalHandler)(new Request(`http://localhost${url}`), context, runtime)) as Response

describe('universalHandler', () => {
  // Must be the first: nothing has applied getUniversalMiddlewares() yet
  it('throws if there are +middleware and getUniversalMiddlewares() was not applied', async () => {
    plusMiddlewares = [enhance(() => new Response('handler'), { name: 'handler', method: 'GET', path: '/a' })]
    await expect(render('/a')).rejects.toThrow("Your +middleware aren't applied")
  })

  it('runs a +middleware that is a handler before the page, and falls through to the page', async () => {
    await getUniversal(getUniversalMiddlewares()[0]!)(new Request('http://localhost/'), {}, runtime)
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
})
