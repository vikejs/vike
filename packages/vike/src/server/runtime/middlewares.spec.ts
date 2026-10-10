import { describe, it, expect } from 'vitest'
import {
  apply,
  enhance,
  getUniversalProp,
  MiddlewareOrder,
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
async function serve(middlewares: Middleware[], url: string) {
  const router = new UniversalRouter(true, false)
  const pages = enhance(() => new Response('page'), { method: 'GET', path: '/**' })
  apply(router, [...middlewares.filter((m) => m.name !== 'vike'), pages])
  const handler = router[universalSymbol] as UniversalHandler
  const response = await handler(new Request(`http://localhost${url}`), {}, {} as RuntimeAdapter)
  return `${response.status} ${await response.text()}`
}

describe('getMiddlewares()', () => {
  it("marks the handlers, Vike's pages last", () => {
    const middlewares = getMiddlewares([auth, logger, telefunc, orderZero], '/')
    expect(middlewares.map((m) => [m.name, m.isHandler])).toEqual([
      ['auth', false],
      ['logger', false],
      ['telefunc', true],
      ['orderZero', true],
      ['vike', true],
    ])
    // The +middleware themselves are left untouched
    expect('isHandler' in auth).toBe(false)
  })

  it("matches a path against the page's URL: without the Base URL, and for its .pageContext.json", async () => {
    for (const [baseServer, base] of [
      ['/', ''],
      ['/app/', '/app'],
    ] as const) {
      const middlewares = getMiddlewares([auth], baseServer)
      for (const url of ['/dash', '/%64ash', '/dash/index.pageContext.json']) {
        // The +middleware gets the original request
        expect(await serve(middlewares, `${base}${url}`)).toBe(`401 http://localhost${base}${url}`)
      }
      expect(await serve(middlewares, `${base}/about`)).toBe('200 page')
      expect(await serve(middlewares, `${base}/about/index.pageContext.json`)).toBe('200 page')
    }
    // Outside the Base URL
    expect(await serve(getMiddlewares([auth], '/app/'), '/dash')).toBe('200 page')
  })

  it("prepends the Base URL to a handler's path", () => {
    const [handler] = getMiddlewares([telefunc], '/app/')
    expect(getUniversalProp(handler!, pathSymbol)).toBe('/app/_telefunc')
  })
})
