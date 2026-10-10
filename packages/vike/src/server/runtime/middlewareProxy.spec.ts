import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  enhance,
  getUniversal,
  MiddlewareOrder,
  type RuntimeAdapter,
  type UniversalMiddleware,
} from '@universal-middleware/core'
import { middlewaresAfterRoutes, middlewaresBeforeRoutes } from './middlewareProxy.js'
import type { Middleware } from './middlewares.js'

const app = vi.hoisted(() => ({ middlewares: [] as Middleware[], configError: null as null | { err: unknown } }))
vi.mock('./middlewares.js', () => ({ getAppMiddlewares: async () => app.middlewares }))
vi.mock('../../shared-server-node/getVikeConfigError.js', () => ({ getVikeConfigError: () => app.configError }))

const mark = (middleware: ReturnType<typeof enhance>, isHandler: boolean) => Object.assign(middleware, { isHandler })
// A stand-in for Vike's pages
const pages = mark(
  enhance((_request: Request, context: Universal.Context) => new Response(`page ${JSON.stringify(context)}`), {
    name: 'vike',
    method: 'GET',
    path: '/**',
  }),
  true,
)
const user = mark(
  enhance(() => ({ user: 'alice' }), { name: 'user', order: MiddlewareOrder.AUTHENTICATION }),
  false,
)
const header = mark(
  enhance(() => (response: Response) => (response.headers.set('x-header', '1'), response), { name: 'header' }),
  false,
)
const auth = mark(
  enhance((_request: Request, context: Universal.Context) => (context.user ? undefined : new Response('401')), {
    name: 'auth',
    order: MiddlewareOrder.AUTHORIZATION,
  }),
  false,
)
const hello = mark(
  enhance(() => new Response('hello'), { name: 'hello', method: 'GET', path: '/hello' }),
  true,
)

const run = async (half: UniversalMiddleware, url: string, context: Universal.Context = {}, method = 'GET') =>
  getUniversal(half)(new Request(`http://localhost${url}`, { method }), context, {} as RuntimeAdapter)

beforeEach(() => {
  app.configError = null
})

describe('middlewaresBeforeRoutes', () => {
  it("runs the +middleware that aren't handlers in their order, and passes the request on with their context", async () => {
    // `auth` sees the user that `user` adds, although it's listed first
    app.middlewares = [auth, user, hello, pages]
    const context: Universal.Context = {}
    expect(await run(middlewaresBeforeRoutes, '/', context)).toBe(undefined)
    expect(context).toEqual({ user: 'alice' })
  })

  it("answers with a +middleware's Response, its response functions applied", async () => {
    app.middlewares = [header, auth, pages]
    const response = (await run(middlewaresBeforeRoutes, '/')) as Response
    expect([await response.text(), response.headers.get('x-header')]).toEqual(['401', '1'])
  })

  it('returns the response functions, for the response of the routes after it', async () => {
    app.middlewares = [header, pages]
    const applyResponseFunctions = (await run(middlewaresBeforeRoutes, '/')) as (
      response: Response,
    ) => Promise<Response>
    expect((await applyResponseFunctions(new Response('route'))).headers.get('x-header')).toBe('1')
  })

  it("answers with Vike's pages upon an invalid config, instead of passing the request on to the app's routes", async () => {
    app.middlewares = [pages]
    app.configError = { err: new Error('config') }
    expect(await ((await run(middlewaresBeforeRoutes, '/')) as Response).text()).toBe('page {}')
  })
})

describe('middlewaresAfterRoutes', () => {
  it('runs the +middleware that are handlers, then the pages, with the context', async () => {
    app.middlewares = [auth, hello, pages]
    expect(await ((await run(middlewaresAfterRoutes, '/hello')) as Response).text()).toBe('hello')
    expect(await ((await run(middlewaresAfterRoutes, '/', { user: 'alice' })) as Response).text()).toBe(
      'page {"user":"alice"}',
    )
  })

  it("lets Vike's pages answer every method when no +middleware is a handler (e.g. PROPFIND)", async () => {
    app.middlewares = [user, pages]
    expect(await ((await run(middlewaresAfterRoutes, '/', {}, 'PROPFIND')) as Response).text()).toBe('page {}')
  })
})
