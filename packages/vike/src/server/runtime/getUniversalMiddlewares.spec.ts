import { describe, it, expect } from 'vitest'
import { enhance, type RuntimeAdapter } from '@universal-middleware/core'
import { runPlusMiddlewares } from './getUniversalMiddlewares.js'

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
