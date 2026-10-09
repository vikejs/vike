import { describe, it, expect, vi } from 'vitest'
import {
  enhance,
  getUniversal,
  getUniversalProp,
  orderSymbol,
  pathSymbol,
  type RuntimeAdapter,
} from '@universal-middleware/core'

let plusMiddlewares: unknown[] = []
vi.mock('./globalContext.js', () => ({
  getGlobalContextServerInternal: async () => ({
    globalContext: { config: { middleware: plusMiddlewares }, baseServer: '/' },
  }),
}))
vi.mock('./renderPageServer.js', () => ({
  renderPageServerConfigError: async () => null,
}))
const { getUniversalMiddlewares, runPlusMiddlewares, runUniversalMiddlewares } = await import(
  './getUniversalMiddlewares.js'
)

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

// Universal Middleware core's isHandler(), which it doesn't export
const isHandler = (middleware: Parameters<typeof getUniversalProp>[0]) => {
  const order = getUniversalProp(middleware, orderSymbol)
  return typeof order === 'number' ? order === 0 : Boolean(getUniversalProp(middleware, pathSymbol))
}

describe('getUniversalMiddlewares()', () => {
  const runtime = {} as RuntimeAdapter
  const [nonHandler, ...others] = getUniversalMiddlewares()
  const call = (url: string) => getUniversal(nonHandler)(new Request(`http://localhost${url}`), {}, runtime)
  const text = async (result: unknown) => (result instanceof Response ? result.text() : 'passed on')

  // Each answers with its name
  const answer = (name: string, options: object) => enhance(() => new Response(name), { name, ...options })
  const plain = answer('plain', {})
  const onPath = answer('onPath', { method: 'GET', path: '/a' })
  const orderZero = answer('orderZero', { method: 'GET', path: '/c', order: 0 })
  const scoped = answer('scoped', { method: 'GET', path: '/b', order: -10 })

  it('returns one middleware, which is not a handler', () => {
    expect(others).toEqual([])
    expect(isHandler(nonHandler)).toBe(false)
  })

  it("runs the +middleware that aren't handlers, upon each request", async () => {
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
