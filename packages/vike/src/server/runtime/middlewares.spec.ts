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
} from '@universal-middleware/core'
import { getMiddlewares, type Middleware } from './middlewares.js'
import { applyMiddlewares } from './middlewaresProxy.js'

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
    for (const [baseServer, base] of bases) {
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
      // Decoded once only
      expect(await serve(middlewares, `${base}/%2564ash`)).toBe('200 page')
      expect(await serve(middlewares, `${base}/%2564ash/index.pageContext.json`)).toBe('200 page')
    }
    // Outside the Base URL
    expect(await serve(getMiddlewares([auth], '/app/'), '/dash')).toBe('200 page')
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
        const middlewares = getMiddlewares([authAt(path)], baseServer)
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
    const [middleware] = getMiddlewares([jsonAuth], '/')
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

  it('warns about a path that starts with the Base URL', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const guard = (path: string, name = 'guard') => enhance(() => undefined, { name, method: 'GET', path })
    getMiddlewares([guard('/app/dash')], '/app/')
    expect(warn).toHaveBeenCalledTimes(1)
    const message = String(warn.mock.calls[0]![0])
    expect(message).toContain('+middleware guard has the path /app/dash')
    expect(message).toContain('relative to the Base URL, use /dash instead')
    // Once per +middleware and path
    getMiddlewares([guard('/app/dash')], '/app/')
    // No warning: a path relative to the Base URL, no Base URL, no path
    getMiddlewares([guard('/dash'), guard('/other/dash'), guard('/application'), logger], '/app/')
    getMiddlewares([guard('/app/other')], '/')
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
        getMiddlewares(
          [enhance(() => new Response(), { name: `handler-${baseServer}`, method: 'GET', path })],
          baseServer,
        )
        expect(warn).toHaveBeenCalledTimes(1)
        expect(String(warn.mock.calls[0]![0])).toContain(`use ${relativePath} instead`)
      }
      warn.mockClear()
      getMiddlewares([guard('/basement', `guard-${baseServer}`)], baseServer)
      expect(warn).not.toHaveBeenCalled()
    }
    warn.mockRestore()
  })

  it("prepends the Base URL to a handler's path", () => {
    const [handler] = getMiddlewares([telefunc], '/app/')
    expect(getUniversalProp(handler!, pathSymbol)).toBe('/app/_telefunc')
  })

  it("keeps a handler's context", async () => {
    const handler = enhance((_request: Request, context: Universal.Context) => new Response(String(context.foo)), {
      name: 'metadata',
      method: 'GET',
      path: '/metadata',
      context: { foo: 'bar' },
    })
    expect(await serve(getMiddlewares([handler], '/'), '/metadata')).toBe('200 bar')
  })
})

describe('applyMiddlewares()', () => {
  it('cancels the body a response function replaces', async () => {
    let cancelled = false
    const body = new ReadableStream({
      cancel() {
        cancelled = true
      },
    })
    const stream = enhance(() => new Response(body), { name: 'stream' })
    const replace = enhance(() => () => new Response('Replaced'), { name: 'replace' })
    const middlewares = getMiddlewares([replace, stream], '/')
    const response = await applyMiddlewares(middlewares, new Request('http://localhost/'), {}, {} as RuntimeAdapter)
    expect(await (response as Response).text()).toBe('Replaced')
    await vi.waitFor(() => expect(cancelled).toBe(true))
  })
})
