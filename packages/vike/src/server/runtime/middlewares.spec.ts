import { describe, it, expect } from 'vitest'
import {
  apply,
  enhance,
  getUniversalProp,
  MiddlewareOrder,
  orderSymbol,
  pathSymbol,
  UniversalRouter,
  universalSymbol,
  type RuntimeAdapter,
  type UniversalHandler,
} from '@universal-middleware/core'
import { getMiddlewares, type Middleware } from './middlewares.js'

const auth = enhance((request: Request) => new Response(request.url, { status: 401 }), {
  name: 'auth',
  method: 'GET',
  path: '/dash',
  order: MiddlewareOrder.AUTHORIZATION,
})
const logger = enhance(() => undefined, { name: 'logger' })
const telefunc = enhance(() => new Response('telefunc'), { name: 'telefunc', method: 'POST', path: '/_telefunc' })
const orderZero = enhance(() => new Response('order zero'), { name: 'orderZero', path: '/order-zero', order: 0 })

// Applies the list as a server does, with a stand-in for Vike's pages
async function serve(middlewares: Middleware[], url: string, method = 'GET') {
  const router = new UniversalRouter(true, false)
  const pages = enhance(() => new Response('page'), { method: ['GET', 'HEAD', 'POST'], path: '/**' })
  apply(router, [...middlewares.filter((m) => m.name !== 'vike'), pages])
  const handler = router[universalSymbol] as UniversalHandler
  const response = await handler(new Request(`http://localhost${url}`, { method }), {}, {} as RuntimeAdapter)
  return `${response.status} ${await response.text()}`
}

describe('getMiddlewares()', () => {
  it("marks the handlers, Vike's pages last", () => {
    const middlewares = getMiddlewares([auth, logger, telefunc, orderZero], '/')
    expect(middlewares.map((m) => [m.name, m.isHandler, getUniversalProp(m, orderSymbol)])).toEqual([
      ['auth', false, MiddlewareOrder.AUTHORIZATION],
      ['logger', false, undefined],
      ['telefunc', true, undefined],
      ['orderZero', true, 0],
      ['vike', true, undefined],
    ])
    // The +middleware themselves are left untouched
    for (const plusMiddleware of [auth, logger, telefunc, orderZero]) expect('isHandler' in plusMiddleware).toBe(false)
  })

  it("matches a path against the page's URL: without the Base URL, and for its .pageContext.json", async () => {
    for (const [baseServer, base] of [
      ['/', ''],
      ['/app/', '/app'],
    ] as const) {
      const middlewares = getMiddlewares([auth], baseServer)
      for (const url of ['/dash', '/%64ash']) {
        // The +middleware gets the original request
        expect(await serve(middlewares, `${base}${url}`)).toBe(`401 http://localhost${base}${url}`)
      }
      // A 404, so that the client router reloads the page
      const url = `${base}/dash/index.pageContext.json`
      expect(await serve(middlewares, url)).toBe(`404 http://localhost${url}`)
      expect(await serve(middlewares, `${base}/about`)).toBe('200 page')
      expect(await serve(middlewares, `${base}/about/index.pageContext.json`)).toBe('200 page')
    }
    // Outside the Base URL
    expect(await serve(getMiddlewares([auth], '/app/'), '/dash')).toBe('200 page')
  })

  it('answers a .pageContext.json request with a 404 when a response function replaces the page', async () => {
    const replace = enhance(() => () => new Response('Replaced', { status: 401 }), { name: 'replace' })
    const middlewares = getMiddlewares([replace], '/')
    expect(await serve(middlewares, '/about/index.pageContext.json')).toBe('404 Replaced')
    expect(await serve(middlewares, '/about')).toBe('401 Replaced')
  })

  it('keeps the order: a +middleware without one is ordered as 0', async () => {
    const answers = enhance(() => new Response('answers'), { name: 'answers' })
    expect(await serve(getMiddlewares([answers, auth], '/'), '/dash')).toBe('401 http://localhost/dash')
  })

  it('matches the method, HEAD as GET', async () => {
    const middlewares = getMiddlewares([auth], '/')
    expect(await serve(middlewares, '/dash', 'POST')).toBe('200 page')
    expect(await serve(middlewares, '/dash', 'HEAD')).toBe('401 http://localhost/dash')
  })

  it("prepends the Base URL to a handler's path", () => {
    const [handler] = getMiddlewares([telefunc], '/app/')
    expect(getUniversalProp(handler!, pathSymbol)).toBe('/app/_telefunc')
  })
})
