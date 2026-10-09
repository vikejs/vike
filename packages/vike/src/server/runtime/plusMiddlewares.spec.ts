import { describe, it, expect, vi } from 'vitest'
import {
  enhance,
  getUniversal,
  getUniversalProp,
  methodSymbol,
  nameSymbol,
  orderSymbol,
  pathSymbol,
  pipeRoute,
  type EnhancedMiddleware,
  type RuntimeAdapter,
} from '@universal-middleware/core'

let plusMiddlewares: unknown[] = []
let vikeConfigError: { err: Error } | null = null
vi.mock('./globalContext.js', () => ({
  getGlobalContextServerInternal: async () => ({
    globalContext: { config: { middleware: plusMiddlewares }, baseServer: '/' },
  }),
}))
// The page renders its url
vi.mock('./renderPageServer.js', () => ({
  renderPageServer: async (pageContextInit: { urlOriginal: string }) => ({
    httpResponse: {
      statusCode: 200,
      headers: [],
      getReadableWebStream: () => new Response(`page ${new URL(pageContextInit.urlOriginal).pathname}`).body,
    },
  }),
  renderPageServerConfigError: async () =>
    vikeConfigError && {
      httpResponse: {
        statusCode: 500,
        headers: [],
        getReadableWebStream: () => new Response(vikeConfigError!.err.message).body,
      },
    },
}))
const { addMiddlewares, isHandler, plusMiddlewareProxy, runPlusMiddlewares, runUniversalMiddlewares } = await import(
  './plusMiddlewares.js'
)
const { onPlusMiddlewareChange, notifyPlusMiddlewareChange } = await import('./plusMiddlewareChange.js')
const { pageMethods } = await import('./pagesHandler.js')

// What `(await getGlobalContext()).middlewares` returns for the current `plusMiddlewares`
const getMiddlewares = () => addMiddlewares({}, { middleware: plusMiddlewares as EnhancedMiddleware[] }).middlewares

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
  it('starts a path with /, and warns about a - right after a parameter name', async () => {
    expect(await run('dash', '/dash', '/')).toEqual([401, 'http://localhost/dash'])
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      await run('/users/:user-id', '/users/5', '/')
      expect(warn).toHaveBeenCalledTimes(1)
      expect(String(warn.mock.calls[0]![0])).toContain(':userId instead of :user-id')
    } finally {
      warn.mockRestore()
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

describe('globalContext.middlewares', () => {
  const runtime = {} as RuntimeAdapter
  const call = (middleware: unknown, url: string, method = 'GET') =>
    getUniversal(middleware as EnhancedMiddleware)(new Request(`http://localhost${url}`, { method }), {}, runtime)
  const text = async (result: unknown) => (result instanceof Response ? result.text() : 'passed on')
  const names = (middlewares: EnhancedMiddleware[]) => middlewares.map((m) => getUniversalProp(m, nameSymbol))

  // Each answers with its name
  const answer = (name: string, options: object) => enhance(() => new Response(name), { name, ...options })
  const plain = answer('plain', {})
  const onPath = answer('onPath', { method: 'GET', path: '/a' })
  const orderZero = answer('orderZero', { method: 'GET', path: '/c', order: 0 })
  const scoped = answer('scoped', { method: 'GET', path: '/b', order: -10 })
  const early = answer('early', { order: -20 })

  it('holds the +middleware that are not handlers by order, then the handlers in config order, then the pages', () => {
    plusMiddlewares = [[plain], [orderZero, onPath], scoped, early]
    const middlewares = getMiddlewares()
    expect(Array.isArray(middlewares)).toBe(true)
    expect(names(middlewares)).toEqual(['early', 'scoped', 'plain', 'orderZero', 'onPath', 'vike'])
    plusMiddlewares = []
    expect(names(getMiddlewares())).toEqual(['vike'])
  })

  it('marks each element with a plain isHandler: the handlers, and the pages as the last one', () => {
    plusMiddlewares = [plain, orderZero, onPath, scoped]
    const middlewares = getMiddlewares()
    expect(middlewares.map((m) => m.isHandler)).toEqual([false, false, true, true, true])
    // The same rule as Universal Middleware's, which `apply()` follows
    for (const m of middlewares.slice(0, 2)) expect(isHandler(m)).toBe(false)
    const pages = middlewares.at(-1)!
    expect(pages.isHandler).toBe(true)
    expect(getUniversalProp(pages, pathSymbol)).toBe('/**')
    expect(getUniversalProp(pages, methodSymbol)).toEqual(pageMethods)
    expect(isHandler(pages)).toBe(true)
  })

  it('returns elements that each run their own +middleware, limited to its path, whatever the server does', async () => {
    plusMiddlewares = [plain, scoped]
    const [scopedElement, plainElement] = getMiddlewares()
    // The path and method are matched inside the element, on the page's URL: the server's router must not see them
    expect(getUniversalProp(scopedElement!, pathSymbol)).toBeUndefined()
    expect(getUniversalProp(scopedElement!, methodSymbol)).toBeUndefined()
    expect(await text(await call(plainElement, '/anything'))).toBe('plain')
    expect(await text(await call(scopedElement, '/b'))).toBe('scoped')
    expect(await text(await call(scopedElement, '/b/index.pageContext.json'))).toBe('scoped')
    expect(await text(await call(scopedElement, '/b', 'HEAD'))).toBe('scoped')
    expect(await text(await call(scopedElement, '/other'))).toBe('passed on')
  })

  it("gives an element the order and name of its +middleware, and leaves them out if it has none, so that Universal Middleware's defaults apply", () => {
    const unnamed = enhance(() => undefined, {})
    plusMiddlewares = [plain, unnamed, scoped]
    const [scopedElement, plainElement, unnamedElement] = getMiddlewares()
    expect(getUniversalProp(scopedElement!, orderSymbol, 0)).toBe(-10)
    expect(getUniversalProp(scopedElement!, nameSymbol)).toBe('scoped')
    // `order: undefined` as a key would hide the default (0) that apply() sorts by
    expect(getUniversalProp(plainElement!, orderSymbol, 0)).toBe(0)
    expect(getUniversalProp(unnamedElement!, orderSymbol, 0)).toBe(0)
    expect(getUniversalProp(unnamedElement!, nameSymbol, 'default')).toBe('default')
    // The same for a handler, which has no order either
    plusMiddlewares = [unnamed, onPath]
    expect(getUniversalProp(getMiddlewares()[0]!, orderSymbol, 0)).toBe(0)
  })

  it('returns handler elements that run on the page URL, only if they are the most specific, and otherwise pass on', async () => {
    const withContext = enhance(() => ({ fromHandler: 'yes' }), { name: 'context', method: 'GET', path: '/a/**' })
    plusMiddlewares = [onPath, withContext]
    const [first, second] = getMiddlewares()
    // The router must not see them either: a handler passes on to the next, then to the pages
    for (const m of [first, second]) {
      expect(getUniversalProp(m!, pathSymbol)).toBeUndefined()
      expect(getUniversalProp(m!, methodSymbol)).toBeUndefined()
      expect(getUniversalProp(m!, orderSymbol)).toBeUndefined()
    }
    expect(await text(await call(first, '/a'))).toBe('onPath')
    expect(await text(await call(first, '/a/index.pageContext.json'))).toBe('onPath')
    expect(await text(await call(first, '/other'))).toBe('passed on')
    // `/a` is the most specific path for `/a`, so the broader handler doesn't run, and doesn't answer
    expect(await call(second, '/a')).toEqual({})
    expect(await call(second, '/a/b')).toEqual({ fromHandler: 'yes' })
    // `/a/b` isn't matched by the first
    expect(await text(await call(first, '/a/b'))).toBe('passed on')
  })

  it('works with Universal Middleware: the elements in order, a handler instead of the pages', async () => {
    plusMiddlewares = [onPath, scoped]
    const handler = pipeRoute(getMiddlewares()) as (...args: unknown[]) => Promise<Response | undefined>
    const request = (url: string) => new Request(`http://localhost${url}`)
    expect(await text(await handler(request('/b'), {}, runtime))).toBe('scoped')
    expect(await text(await handler(request('/a'), {}, runtime))).toBe('onPath')
    expect(await text(await handler(request('/z'), {}, runtime))).toBe('page /z')
  })

  it("doesn't pick up a +middleware added after the list was returned", () => {
    plusMiddlewares = [plain]
    const middlewares = getMiddlewares()
    plusMiddlewares = [plain, scoped]
    expect(middlewares).toHaveLength(2)
  })

  it('is created when it is read, and not enumerable', () => {
    plusMiddlewares = [plain]
    const globalContext = addMiddlewares(
      { isGlobalContext: true },
      { middleware: plusMiddlewares as EnhancedMiddleware[] },
    )
    expect(Object.keys(globalContext)).toEqual(['isGlobalContext'])
    expect({ ...globalContext }).not.toHaveProperty('middlewares')
    expect(globalContext.middlewares).toBe(globalContext.middlewares)
  })

  describe('when a +middleware changes', () => {
    const fixed = [plain]
    const changed = [plain, scoped]
    it('notifies the server that read the list', () => {
      const listener = vi.fn()
      const remove = onPlusMiddlewareChange(listener)
      plusMiddlewares = fixed
      getMiddlewares()
      notifyPlusMiddlewareChange(changed)
      remove()
      expect(listener).toHaveBeenCalledTimes(1)
    })
    it("doesn't notify a server that didn't read the list since the last change", () => {
      const listener = vi.fn()
      const remove = onPlusMiddlewareChange(listener)
      // The change above reset it
      notifyPlusMiddlewareChange(fixed)
      remove()
      expect(listener).not.toHaveBeenCalled()
    })
    it("doesn't notify when only what the +middleware import changed", () => {
      const listener = vi.fn()
      plusMiddlewares = fixed
      getMiddlewares()
      const remove = onPlusMiddlewareChange(listener)
      notifyPlusMiddlewareChange([...fixed])
      remove()
      expect(listener).not.toHaveBeenCalled()
    })
  })

  describe('with an erroneous Vike config', () => {
    it('returns elements that answer every request with the error response of the config', async () => {
      plusMiddlewares = [plain, onPath]
      const middlewares = getMiddlewares()
      vikeConfigError = { err: new Error('broken config') }
      try {
        for (const url of ['/', '/a', '/anything/index.pageContext.json']) {
          for (const middleware of middlewares.slice(0, 2)) {
            const response = (await call(middleware, url)) as Response
            expect([url, response.status, await response.text()]).toEqual([url, 500, 'broken config'])
          }
        }
      } finally {
        vikeConfigError = null
      }
    })

    it('runs the +middleware once the config is fixed', async () => {
      plusMiddlewares = [scoped]
      const [middleware] = getMiddlewares()
      vikeConfigError = { err: new Error('broken config') }
      expect(((await call(middleware, '/b')) as Response).status).toBe(500)
      vikeConfigError = null
      expect(await text(await call(middleware, '/b'))).toBe('scoped')
      expect(await text(await call(middleware, '/other'))).toBe('passed on')
    })
  })
})

describe('plusMiddlewareProxy', () => {
  const runtime = {} as RuntimeAdapter
  const [beforeRoutes, withPages] = plusMiddlewareProxy
  const call = (url: string) => getUniversal(beforeRoutes!)(new Request(`http://localhost${url}`), {}, runtime)
  const text = async (result: unknown) => (result instanceof Response ? result.text() : 'passed on')
  const answer = (name: string, options: object) => enhance(() => new Response(name), { name, ...options })
  const plain = answer('plain', {})
  const onPath = answer('onPath', { method: 'GET', path: '/a' })
  const orderZero = answer('orderZero', { method: 'GET', path: '/c', order: 0 })
  const scoped = answer('scoped', { method: 'GET', path: '/b', order: -10 })

  it('holds the element that runs before the routes, and the one that runs with the pages after them', () => {
    expect(plusMiddlewareProxy.map((m) => m.isHandler)).toEqual([false, true])
    expect(isHandler(beforeRoutes!)).toBe(false)
    expect(isHandler(withPages!)).toBe(true)
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
