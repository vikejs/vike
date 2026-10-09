import { describe, it, expect, vi } from 'vitest'
import {
  apply,
  enhance,
  MiddlewareOrder,
  UniversalRouter,
  universalSymbol,
  type RuntimeAdapter,
} from '@universal-middleware/core'
import type { UniversalHandler } from '@universal-middleware/core'
import { assertMiddlewarePath, getRoutingRequest, withOriginalRequest } from './getRoutingRequest.js'

// Routes like renderPageServer() does: a +middleware on `path` that denies the request and tells which URL it was given
const run = async (path: string | undefined, url: string, baseServer: string) => {
  const request = new Request(`http://localhost${url}`)
  const guard = enhance((request: Request) => new Response(request.url, { status: 401 }), {
    name: 'guard',
    order: MiddlewareOrder.AUTHORIZATION,
    ...(path && { method: 'GET', path }),
  })
  const vike = enhance(() => new Response('page'), { name: 'vike', method: 'GET', path: '/**' })
  const router = new UniversalRouter(true, false)
  apply(router, [vike, withOriginalRequest(guard, request)])
  const handler = router[universalSymbol] as UniversalHandler
  const response = (await handler(getRoutingRequest(request, baseServer), {}, {} as RuntimeAdapter)) as Response
  return [response.status, await response.text()]
}

describe('getRoutingRequest()', () => {
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
  it('runs a +middleware without a path for every URL', async () => {
    for (const url of ['/', '/dash', '/dash/index.pageContext.json']) {
      expect((await run(undefined, url, '/'))[0]).toBe(401)
    }
  })
  it("doesn't run a +middleware for another path", async () => {
    expect(await run('/dash', '/about', '/')).toEqual([200, 'page'])
    expect(await run('/dash', '/about/index.pageContext.json', '/')).toEqual([200, 'page'])
    // `%2564ash` is the literal text `%64ash`, not `dash`
    expect(await run('/dash', '/%2564ash', '/')).toEqual([200, 'page'])
    expect(await run('/dash', '/%2564ash/index.pageContext.json', '/app/')).toEqual([200, 'page'])
  })
})

describe('withOriginalRequest()', () => {
  it("keeps the +middleware's context", async () => {
    const handler = enhance((_request: Request, context: Universal.Context) => new Response(String(context.foo)), {
      name: 'metadata',
      method: 'GET',
      path: '/metadata',
      context: { foo: 'bar' },
    })
    const request = new Request('http://localhost/metadata')
    const router = new UniversalRouter(true, false)
    apply(router, [withOriginalRequest(handler, request)])
    const response = (await (router[universalSymbol] as UniversalHandler)(
      getRoutingRequest(request, '/'),
      {},
      {} as RuntimeAdapter,
    )) as Response
    expect(await response.text()).toBe('bar')
  })
})

describe('assertMiddlewarePath()', () => {
  const guard = (path: string, name = 'guard') => enhance(() => undefined, { name, method: 'GET', path })
  it('warns about a path that starts with the Base URL', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    assertMiddlewarePath(guard('/app/dash'), '/app/')
    expect(warn).toHaveBeenCalledTimes(1)
    const message = String(warn.mock.calls[0]![0])
    expect(message).toContain('+middleware guard has the path /app/dash')
    expect(message).toContain('relative to the Base URL, use /dash instead')
    // The path may still be meant: it's not said to match nothing
    expect(message).not.toMatch(/nothing|only/)
    // Once per +middleware and path
    assertMiddlewarePath(guard('/app/dash'), '/app/')
    expect(warn).toHaveBeenCalledTimes(1)
    // No warning: a path relative to the Base URL, no Base URL, no path
    assertMiddlewarePath(guard('/dash'), '/app/')
    assertMiddlewarePath(guard('/other/dash'), '/app/')
    assertMiddlewarePath(guard('/application'), '/app/')
    assertMiddlewarePath(guard('/app/other'), '/')
    assertMiddlewarePath(
      enhance(() => undefined, { name: 'guard' }),
      '/app/',
    )
    expect(warn).toHaveBeenCalledTimes(1)
    warn.mockRestore()
  })
  it('suggests the relative path whether or not the Base URL ends with a slash', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    for (const baseServer of ['/base', '/base/']) {
      for (const [path, relativePath] of [
        ['/base/dash', '/dash'],
        ['/base/**', '/**'],
        ['/base', '/'],
        ['/base/', '/'],
      ]) {
        warn.mockClear()
        assertMiddlewarePath(guard(path!, `guard-${baseServer}`), baseServer)
        expect(warn).toHaveBeenCalledTimes(1)
        expect(String(warn.mock.calls[0]![0])).toContain(`use ${relativePath} instead`)
      }
      warn.mockClear()
      assertMiddlewarePath(guard('/basement', `guard-${baseServer}`), baseServer)
      expect(warn).not.toHaveBeenCalled()
    }
    warn.mockRestore()
  })
})
