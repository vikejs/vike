import { describe, it, expect, vi } from 'vitest'
import {
  enhance,
  getUniversal,
  getUniversalProp,
  methodSymbol,
  nameSymbol,
  orderSymbol,
  pathSymbol,
  type EnhancedMiddleware,
  type RuntimeAdapter,
} from '@universal-middleware/core'

let plusMiddlewares: unknown[] = []
let vikeConfigError: { err: Error } | null = null
vi.mock('./globalContext.js', () => ({
  // Like the real one: the global context of an erroneous config is never ready
  initGlobalContext_renderPage: async () => {
    if (vikeConfigError) await new Promise(() => {})
  },
  getGlobalContextServerInternal: async () => ({
    globalContext: { config: { middleware: plusMiddlewares }, baseServer: '/' },
  }),
}))
vi.mock('../../shared-server-node/getVikeConfigError.js', () => ({
  getVikeConfigError: () => vikeConfigError,
}))
vi.mock('./renderPageServer.js', () => ({
  renderPageServerConfigError: async () =>
    vikeConfigError && {
      httpResponse: {
        statusCode: 500,
        headers: [],
        getReadableWebStream: () => new Response(vikeConfigError!.err.message).body,
      },
    },
}))
const { getUniversalMiddlewares, isHandler, plusMiddlewareProxy, runPlusMiddlewares, runUniversalMiddlewares } =
  await import('./getUniversalMiddlewares.js')

// A +middleware on `path` that denies the request, and tells which URL it was given
const run = async (path: string, url: string, baseServer: string) => {
  const guard = enhance((request: Request) => new Response(request.url, { status: 401 }), {
    name: 'guard',
    method: 'GET',
    path,
  })
  const request = new Request(`http://localhost${url}`)
  const response = await runPlusMiddlewares([guard], baseServer, request, {}, {} as RuntimeAdapter)
  return response instanceof Response ? [response.status, await response.text()] : ['passed on']
}

describe('runPlusMiddlewares()', () => {
  it("matches a path against the page's URL: with the Base URL, and for its .pageContext.json", async () => {
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
    for (const [path, urls] of cases) {
      for (const baseServer of ['/', '/app/']) {
        for (const url of urls) {
          const pageUrl = baseServer === '/' ? url : `/app${url}`
          const pageContextUrl = `${pageUrl.replace(/\/$/, '')}/index.pageContext.json`
          for (const requestUrl of [pageUrl, pageContextUrl]) {
            const [status, receivedUrl] = await run(path, requestUrl, baseServer)
            expect([path, requestUrl, status]).toEqual([path, requestUrl, 401])
            // The +middleware gets the original request
            expect(receivedUrl).toBe(`http://localhost${requestUrl}`)
          }
        }
      }
    }
  })
  it('runs every +middleware limited to a path with an order, and applies their response handlers', async () => {
    const seen: string[] = []
    const scopedTo = (path: string, order: number) =>
      enhance(
        () => {
          seen.push(path)
          return (response: Response) => (response.headers.append('x-seen', path), response)
        },
        { name: path, method: 'GET', path, order },
      )
    const middlewares = [scopedTo('/admin/**', -20), scopedTo('/admin/settings', -10), scopedTo('/other', -10)]
    const result = await runPlusMiddlewares(
      middlewares,
      '/',
      new Request('http://localhost/admin/settings'),
      {},
      {} as RuntimeAdapter,
    )
    expect(seen).toEqual(['/admin/**', '/admin/settings'])
    const response = await (result as (response: Response) => Promise<Response>)(new Response('page'))
    expect(response.headers.get('x-seen')).toBe('/admin/**, /admin/settings')
  })
  it("keeps the `context` a +middleware was enhanced with, the context it's given", async () => {
    const middleware = enhance(
      (_request: Request, context: Universal.Context) => new Response((context as { seeded?: string }).seeded),
      { name: 'seeded', method: 'GET', path: '/a', context: { seeded: 'yes' } },
    )
    const result = await runPlusMiddlewares(
      [middleware],
      '/',
      new Request('http://localhost/a'),
      {},
      {} as RuntimeAdapter,
    )
    expect(await (result as Response).text()).toBe('yes')
  })
  it('runs a +middleware without a path for every URL', async () => {
    const middleware = enhance((request: Request) => new Response(request.url, { status: 401 }), { name: 'all' })
    for (const url of ['/', '/dash', '/dash/index.pageContext.json']) {
      const response = await runPlusMiddlewares(
        [middleware],
        '/',
        new Request(`http://localhost${url}`),
        {},
        {} as RuntimeAdapter,
      )
      expect(response instanceof Response && response.status).toBe(401)
    }
  })
  it("doesn't run a +middleware for another path", async () => {
    expect(await run('/dash', '/about', '/')).toEqual(['passed on'])
    expect(await run('/dash', '/about/index.pageContext.json', '/')).toEqual(['passed on'])
    // `%2564ash` is the literal text `%64ash`, not `dash`
    expect(await run('/dash', '/%2564ash', '/')).toEqual(['passed on'])
    expect(await run('/dash', '/%2564ash/index.pageContext.json', '/app/')).toEqual(['passed on'])
  })
})

describe('getUniversalMiddlewares()', () => {
  const runtime = {} as RuntimeAdapter
  const call = (middleware: unknown, url: string, method = 'GET') =>
    getUniversal(middleware as EnhancedMiddleware)(new Request(`http://localhost${url}`, { method }), {}, runtime)
  const text = async (result: unknown) => (result instanceof Response ? result.text() : 'passed on')

  // Each answers with its name
  const answer = (name: string, options: object) => enhance(() => new Response(name), { name, ...options })
  const plain = answer('plain', {})
  const onPath = answer('onPath', { method: 'GET', path: '/a' })
  const orderZero = answer('orderZero', { method: 'GET', path: '/c', order: 0 })
  const scoped = answer('scoped', { method: 'GET', path: '/b', order: -10 })

  it('returns the list of the +middleware that are not handlers, flattened and in order', async () => {
    plusMiddlewares = [[plain], [orderZero, onPath], scoped]
    const middlewares = await getUniversalMiddlewares()
    expect(Array.isArray(middlewares)).toBe(true)
    expect(middlewares.map((middleware) => getUniversalProp(middleware, nameSymbol))).toEqual(['plain', 'scoped'])
    // A +middleware limited to a path with a negative order isn't a handler
    expect(middlewares.map((middleware) => getUniversalProp(middleware, orderSymbol))).toEqual([undefined, -10])
    for (const middleware of middlewares) expect(isHandler(middleware)).toBe(false)
    plusMiddlewares = []
    expect(await getUniversalMiddlewares()).toEqual([])
  })

  it('returns elements that each run their own +middleware, limited to its path, whatever the server does', async () => {
    plusMiddlewares = [plain, scoped]
    const [first, second] = await getUniversalMiddlewares()
    // The path and method are matched inside the element, on the page's URL: the server's router must not see them
    expect(getUniversalProp(second!, pathSymbol)).toBeUndefined()
    expect(getUniversalProp(second!, methodSymbol)).toBeUndefined()
    expect(await text(await call(first, '/anything'))).toBe('plain')
    expect(await text(await call(second, '/b'))).toBe('scoped')
    expect(await text(await call(second, '/b/index.pageContext.json'))).toBe('scoped')
    expect(await text(await call(second, '/b', 'HEAD'))).toBe('scoped')
    expect(await text(await call(second, '/other'))).toBe('passed on')
  })

  it("doesn't pick up a +middleware added after the list was returned", async () => {
    plusMiddlewares = [plain]
    const middlewares = await getUniversalMiddlewares()
    plusMiddlewares = [plain, scoped]
    expect(middlewares).toHaveLength(1)
  })

  describe('with an erroneous Vike config', () => {
    const brokenConfig = async () => {
      vikeConfigError = { err: new Error('broken config') }
      try {
        // The global context is never ready: it doesn't wait for it
        const middlewares = await Promise.race([
          getUniversalMiddlewares(),
          new Promise<'hangs'>((resolve) => setTimeout(() => resolve('hangs'), 500)),
        ])
        expect(middlewares).not.toBe('hangs')
        return middlewares as EnhancedMiddleware[]
      } catch (err) {
        vikeConfigError = null
        throw err
      }
    }

    it('returns elements that answer every request with the error response of the config', async () => {
      plusMiddlewares = [plain]
      const middlewares = await brokenConfig()
      try {
        for (const url of ['/', '/b', '/anything/index.pageContext.json']) {
          const response = (await call(middlewares[0], url)) as Response
          expect([url, response.status, await response.text()]).toEqual([url, 500, 'broken config'])
        }
      } finally {
        vikeConfigError = null
      }
    })

    it('runs the +middleware once the config is fixed, without fetching the list again', async () => {
      plusMiddlewares = [scoped]
      const middlewares = await brokenConfig()
      vikeConfigError = null
      expect(await text(await call(middlewares[0], '/b'))).toBe('scoped')
      expect(await text(await call(middlewares[0], '/other'))).toBe('passed on')
    })
  })
})

describe('plusMiddlewareProxy', () => {
  const runtime = {} as RuntimeAdapter
  const call = (url: string) => getUniversal(plusMiddlewareProxy)(new Request(`http://localhost${url}`), {}, runtime)
  const text = async (result: unknown) => (result instanceof Response ? result.text() : 'passed on')
  const answer = (name: string, options: object) => enhance(() => new Response(name), { name, ...options })
  const plain = answer('plain', {})
  const onPath = answer('onPath', { method: 'GET', path: '/a' })
  const orderZero = answer('orderZero', { method: 'GET', path: '/c', order: 0 })
  const scoped = answer('scoped', { method: 'GET', path: '/b', order: -10 })

  it('is not a handler', () => {
    expect(isHandler(plusMiddlewareProxy)).toBe(false)
  })

  it("runs the +middleware that aren't handlers, looked up upon each request", async () => {
    plusMiddlewares = [[plain], [orderZero, onPath]]
    expect(await text(await call('/'))).toBe('plain')
    plusMiddlewares = [onPath, orderZero, scoped]
    // A +middleware limited to a path with a negative order isn't a handler
    expect(await text(await call('/b'))).toBe('scoped')
    expect(await text(await call('/a'))).toBe('passed on')
    expect(await text(await call('/c'))).toBe('passed on')
    plusMiddlewares = []
    expect(await text(await call('/'))).toBe('passed on')
  })
})

describe('runUniversalMiddlewares()', () => {
  const runtime = {} as RuntimeAdapter
  const text = async (result: unknown) => (result instanceof Response ? result.text() : 'passed on')
  const answer = (name: string, options: object) => enhance(() => new Response(name), { name, ...options })
  const orderZero = answer('orderZero', { method: 'GET', path: '/c', order: 0 })
  const run = (url: string, context: Universal.Context = {}) =>
    runUniversalMiddlewares(new Request(`http://localhost${url}`), context, runtime)

  it('applies the response handlers of the +middleware that are not handlers to the answer of a handler', async () => {
    const header = (name: string, options: object) =>
      enhance(() => (response: Response) => (response.headers.append('x-seen', name), response), { name, ...options })
    plusMiddlewares = [header('first', {}), header('second', { method: 'GET', path: '/a', order: -10 }), orderZero]
    const result = await run('/c')
    expect(result).toBeInstanceOf(Response)
    expect((result as Response).headers.get('x-seen')).toBe('first')
    expect(await text(result)).toBe('orderZero')
    const handlerResult = await run('/a')
    expect(typeof handlerResult).toBe('function')
    const response = await (handlerResult as (response: Response) => Promise<Response>)(new Response('page'))
    expect(response.headers.get('x-seen')).toBe('first, second')
  })

  it("runs the +middleware that aren't handlers before the ones that are, which get their context", async () => {
    const order: string[] = []
    const record = (name: string, options: object) =>
      enhance(
        (_request: Request, context: Universal.Context) => {
          order.push(`${name}:${(context as { fromOther?: string }).fromOther}`)
          return name === 'other' ? { fromOther: 'yes' } : undefined
        },
        { name, ...options },
      )
    plusMiddlewares = [record('handler', { method: 'GET', path: '/', order: 0 }), record('other', {})]
    const context: Universal.Context = {}
    await run('/', context)
    expect(order).toEqual(['other:undefined', 'handler:yes'])
    expect(context).toEqual({ fromOther: 'yes' })
  })

  it("doesn't run the handlers once a +middleware that is not a handler answered", async () => {
    plusMiddlewares = [answer('plain', {}), orderZero]
    expect(await text(await run('/c'))).toBe('plain')
  })
})
