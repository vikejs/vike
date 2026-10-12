import { describe, it, expect, vi } from 'vitest'
import {
  enhance,
  getUniversalProp,
  MiddlewareOrder,
  orderSymbol,
  pathSymbol,
  pipeRoute,
  type RuntimeAdapter,
  type UniversalHandler,
  type UniversalMiddleware,
} from '@universal-middleware/core'
import { getMiddlewares_globalContext, type Middleware } from './core.js'
import { pipeNonHandlers } from './middlewaresProxy.js'

// Answers its path with a 401 and the request's URL
const authAt = (path: string) =>
  enhance((request: Request) => new Response(request.url, { status: 401 }), {
    name: 'auth',
    method: 'GET',
    path,
    order: MiddlewareOrder.AUTHORIZATION,
  })
const auth = authAt('/dash')
const logger = enhance(() => undefined, { name: 'logger' })
const telefunc = enhance(() => new Response('telefunc'), { name: 'telefunc', method: 'POST', path: '/_telefunc' })
const orderZero = enhance(() => new Response('order zero'), { name: 'orderZero', path: '/order-zero', order: 0 })
// A Base URL, and the prefix it gives a URL
const bases = [
  ['/', ''],
  ['/app/', '/app'],
] as const

// Applies the list as a server does, with a stand-in for Vike's pages
async function serve(middlewares: Middleware[], url: string, method = 'GET') {
  const pages = enhance(() => new Response('page'), { method: ['GET', 'HEAD', 'POST'], path: '/**' })
  const handler = pipeRoute([...middlewares.filter((m) => m.name !== 'vike'), pages]) as UniversalHandler
  const response = await handler(new Request(`http://localhost${url}`, { method }), {}, {} as RuntimeAdapter)
  return `${response.status} ${await response.text()}`
}

describe('getMiddlewares_globalContext()', () => {
  it("marks the handlers, Vike's pages last", () => {
    const middlewares = getMiddlewares_globalContext([auth, logger, telefunc, orderZero], '/')
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
    for (const [baseServer, base] of bases) {
      const middlewares = getMiddlewares_globalContext([auth], baseServer)
      for (const url of ['/dash', '/%64ash']) {
        // The +middleware gets the original request
        expect(await serve(middlewares, `${base}${url}`)).toBe(`401 http://localhost${base}${url}`)
      }
      // A 404, so that the client router reloads the page
      const url = `${base}/dash/index.pageContext.json`
      expect(await serve(middlewares, url)).toBe(`404 http://localhost${url}`)
      expect(await serve(middlewares, `${base}/about`)).toBe('200 page')
      expect(await serve(middlewares, `${base}/about/index.pageContext.json`)).toBe('200 page')
      // Decoded once only
      expect(await serve(middlewares, `${base}/%2564ash`)).toBe('200 page')
      expect(await serve(middlewares, `${base}/%2564ash/index.pageContext.json`)).toBe('200 page')
    }
    // Outside the Base URL
    expect(await serve(getMiddlewares_globalContext([auth], '/app/'), '/dash')).toBe('200 page')
  })

  it('matches each path syntax, for the page and its .pageContext.json', async () => {
    const cases: [string, string[]][] = [
      ['/', ['/']],
      ['/dash', ['/dash', '/%64ash']],
      ['/dash/**', ['/dash/a', '/dash/a/b']],
      ['/literal%25', ['/literal%25']],
      ['/users/:id?', ['/users', '/users/5']],
      ['/users{/:id}?', ['/users', '/users/5']],
      ['/users{/:id/}?', ['/users', '/users/5']],
      ['{users/:id}?', ['/users/5']],
      ['{en}?/users', ['/users', '/en/users']],
      ['/{en/}?users', ['/users', '/en/users']],
      ['/{en/}?', ['/', '/en/']],
      ['/{en/}?{admin/}?', ['/', '/en/', '/admin/', '/en/admin/']],
      ['/files/:path+', ['/files/a/b']],
      ['/files/*', ['/files/a/b']],
      ['/users/:id(\\d+)', ['/users/5']],
      ['/dash/', ['/dash/']],
    ]
    const failures: string[] = []
    for (const [path, urls] of cases) {
      for (const [baseServer, base] of bases) {
        const middlewares = getMiddlewares_globalContext([authAt(path)], baseServer)
        for (const url of urls) {
          const pageUrl = `${base}${url}`
          for (const requestUrl of [pageUrl, `${pageUrl.replace(/\/$/, '')}/index.pageContext.json`]) {
            // A 404, so that the client router reloads the page
            const status = requestUrl.endsWith('.pageContext.json') ? 404 : 401
            const received = await serve(middlewares, requestUrl)
            if (received !== `${status} http://localhost${requestUrl}`)
              failures.push(`${path} ${requestUrl} -> ${received}`)
          }
        }
      }
    }
    expect(failures).toEqual([])
  })

  it("answers a .pageContext.json request with a 404 without the +middleware's JSON content-type", async () => {
    const jsonAuth = enhance(() => Response.json({ error: 'unauthorized' }, { status: 401 }), { name: 'jsonAuth' })
    const [middleware] = getMiddlewares_globalContext([jsonAuth], '/')
    const request = new Request('http://localhost/dash/index.pageContext.json')
    const response = (await (middleware as UniversalHandler)(request, {}, {} as RuntimeAdapter)) as Response
    expect([response.status, response.headers.get('content-type'), await response.text()]).toEqual([
      404,
      null,
      '{"error":"unauthorized"}',
    ])
  })

  it('answers a .pageContext.json request with a 404 when a response function replaces the page', async () => {
    const replace = enhance(() => () => new Response('Replaced', { status: 401 }), { name: 'replace' })
    const middlewares = getMiddlewares_globalContext([replace], '/')
    expect(await serve(middlewares, '/about/index.pageContext.json')).toBe('404 Replaced')
    expect(await serve(middlewares, '/about')).toBe('401 Replaced')
  })

  it('keeps the order: a +middleware without one is ordered as 0', async () => {
    const answers = enhance(() => new Response('answers'), { name: 'answers' })
    expect(await serve(getMiddlewares_globalContext([answers, auth], '/'), '/dash')).toBe('401 http://localhost/dash')
  })

  it('runs a +middleware with a positive order before the pages, and not once a Response exists', async () => {
    const late = enhance(() => new Response('late'), { name: 'late', order: MiddlewareOrder.RESPONSE_TRANSFORM })
    expect(await serve(getMiddlewares_globalContext([late], '/'), '/about')).toBe('200 late')
    expect(await serve(getMiddlewares_globalContext([auth, late], '/'), '/dash')).toBe('401 http://localhost/dash')
  })

  it('matches the method, HEAD as GET', async () => {
    const middlewares = getMiddlewares_globalContext([auth], '/')
    expect(await serve(middlewares, '/dash', 'POST')).toBe('200 page')
    expect(await serve(middlewares, '/dash', 'HEAD')).toBe('401 http://localhost/dash')
  })

  it('warns about a path that starts with the Base URL', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const guard = (path: string, name = 'guard') => enhance(() => undefined, { name, method: 'GET', path })
    getMiddlewares_globalContext([guard('/app/dash')], '/app/')
    expect(warn).toHaveBeenCalledTimes(1)
    const message = String(warn.mock.calls[0]![0])
    expect(message).toContain('+middleware guard has the path /app/dash')
    expect(message).toContain('relative to the Base URL, use /dash instead')
    // Once per +middleware and path
    getMiddlewares_globalContext([guard('/app/dash')], '/app/')
    // No warning: a path relative to the Base URL, no Base URL, no path
    getMiddlewares_globalContext([guard('/dash'), guard('/other/dash'), guard('/application'), logger], '/app/')
    getMiddlewares_globalContext([guard('/app/other')], '/')
    expect(warn).toHaveBeenCalledTimes(1)
    // A handler's path too, whether or not the Base URL ends with a slash
    for (const baseServer of ['/base', '/base/']) {
      for (const [path, relativePath] of [
        ['/base/dash', '/dash'],
        ['/base/**', '/**'],
        ['/base', '/'],
        ['/base/', '/'],
      ] as const) {
        warn.mockClear()
        getMiddlewares_globalContext(
          [enhance(() => new Response(), { name: `handler-${baseServer}`, method: 'GET', path })],
          baseServer,
        )
        expect(warn).toHaveBeenCalledTimes(1)
        expect(String(warn.mock.calls[0]![0])).toContain(`use ${relativePath} instead`)
      }
      warn.mockClear()
      getMiddlewares_globalContext([guard('/basement', `guard-${baseServer}`)], baseServer)
      expect(warn).not.toHaveBeenCalled()
    }
    warn.mockRestore()
  })

  it("prepends the Base URL to a handler's path", () => {
    const [handler] = getMiddlewares_globalContext([telefunc], '/app/')
    expect(getUniversalProp(handler!, pathSymbol)).toBe('/app/_telefunc')
  })

  it("keeps a handler's context", async () => {
    const handler = enhance((_request: Request, context: Universal.Context) => new Response(String(context.foo)), {
      name: 'metadata',
      method: 'GET',
      path: '/metadata',
      context: { foo: 'bar' },
    })
    expect(await serve(getMiddlewares_globalContext([handler], '/'), '/metadata')).toBe('200 bar')
  })
})

describe('pipeNonHandlers()', () => {
  // The user-land universal middlewares, passed to `vike(app, [...])`
  const header = (name: string, order?: number) =>
    enhance(
      () => (response: Response) => {
        response.headers.set(name, 'yes')
        return response
      },
      { name, ...(order !== undefined && { order }) },
    )
  const run = (
    plusMiddlewares: Parameters<typeof getMiddlewares_globalContext>[0],
    url: string,
    middlewaresUserLand: UniversalMiddleware[],
  ) =>
    pipeNonHandlers(getMiddlewares_globalContext(plusMiddlewares, '/'), middlewaresUserLand)(
      new Request(`http://localhost${url}`),
      {},
      {} as RuntimeAdapter,
    )

  it('cancels the body a response function replaces', async () => {
    let cancelled = false
    const body = new ReadableStream({
      cancel() {
        cancelled = true
      },
    })
    const stream = enhance(() => new Response(body), { name: 'stream' })
    const replace = enhance(() => () => new Response('Replaced'), { name: 'replace' })
    const response = await run([replace, stream], '/', [])
    expect(await (response as Response).text()).toBe('Replaced')
    await vi.waitFor(() => expect(cancelled).toBe(true))
  })

  it("applies a user-land universal middleware's response function to a +middleware's answer, and to the page", async () => {
    const answer = (await run([auth], '/dash', [header('x-app')])) as Response
    expect([answer.status, answer.headers.get('x-app')]).toEqual([401, 'yes'])
    const applyResponseFunctions = (await run([auth], '/about', [header('x-app')])) as (
      r: Response,
    ) => Promise<Response>
    expect((await applyResponseFunctions(new Response('page'))).headers.get('x-app')).toBe('yes')
  })

  it('runs a user-land universal middleware on its path only', async () => {
    const apiHeader = enhance(header('x-api'), { path: '/api/**', order: MiddlewareOrder.HEADER_MANAGEMENT })
    const applyResponseFunctions = (await run([], '/api/me', [apiHeader])) as (r: Response) => Promise<Response>
    expect((await applyResponseFunctions(new Response('me'))).headers.get('x-api')).toBe('yes')
    expect(await run([], '/about', [apiHeader])).toBe(undefined)
  })

  it('merges a context a middleware returns into the context, for the middlewares after it and the caller', async () => {
    const user = enhance(() => ({ user: 'alice' }), { name: 'user', order: MiddlewareOrder.AUTHENTICATION })
    let seen: unknown
    const app = enhance(
      (_request: Request, context: Universal.Context) => {
        seen = { ...context }
      },
      { name: 'app' },
    )
    const context: Universal.Context = { urlOriginal: '/' }
    await pipeNonHandlers(getMiddlewares_globalContext([user], '/'), [app])(
      new Request('http://localhost/'),
      context,
      {} as RuntimeAdapter,
    )
    expect([seen, context]).toEqual([
      { urlOriginal: '/', user: 'alice' },
      { urlOriginal: '/', user: 'alice' },
    ])
  })

  it('runs the +middleware and the user-land universal middlewares by order, the +middleware first at equal order', async () => {
    const ran: string[] = []
    const record = (name: string, order?: number) =>
      enhance(
        () => {
          ran.push(name)
        },
        { name, ...(order !== undefined && { order }) },
      )
    await run([record('plus -900', -900), record('plus'), record('plus -800', -800)], '/', [
      record('app'),
      record('app -850', -850),
      record('app -1000', -1000),
    ])
    expect(ran).toEqual(['app -1000', 'plus -900', 'app -850', 'plus -800', 'plus', 'app'])
  })

  it('after the answer, runs the user-land universal middlewares only, and ignores a Response one of them returns', async () => {
    let lateRan = false
    let cancelled = false
    const latePlus = enhance(
      () => {
        lateRan = true
      },
      { name: 'latePlus', order: 100 },
    )
    const late = enhance(() => new Response(new ReadableStream({ cancel: () => void (cancelled = true) })), {
      name: 'late',
      order: 100,
    })
    const response = (await run([auth, latePlus], '/dash', [late, header('x-app', 300)])) as Response
    expect([response.status, await response.text(), response.headers.get('x-app')]).toEqual([
      401,
      'http://localhost/dash',
      'yes',
    ])
    expect(lateRan).toBe(false)
    await vi.waitFor(() => expect(cancelled).toBe(true))
  })
})
