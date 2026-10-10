import { describe, it, expect, vi } from 'vitest'
import universalVikeHandler from './universal-middleware.js'

const app = vi.hoisted(() => ({ withUserMiddleware: false }))
// A stand-in for Vike's pages, so that no app is needed, and a +middleware that adds a user
vi.mock('./middlewares.js', async () => {
  const { enhance } = await import('@universal-middleware/core')
  const pages = enhance(
    (_request: Request, context: Universal.Context) => new Response(context.user ? `page ${context.user}` : 'page'),
    { name: 'vike', method: 'GET', path: '/**' },
  )
  const user = enhance((request: Request) => (request.headers.has('x-user') ? { user: 'alice' } : undefined), {
    name: 'user',
  })
  const middlewares = [Object.assign(pages, { isHandler: true })]
  const withUser = [Object.assign(user, { isHandler: false }), ...middlewares]
  return { getAppMiddlewares: async () => (app.withUserMiddleware ? withUser : middlewares) }
})

describe('universalVikeHandler()', () => {
  it('answers a request passed alone, as in `vike.fetch(request)`', async () => {
    const response = await universalVikeHandler(new Request('http://localhost/about'))
    expect(await response.text()).toBe('page')
  })

  it("lets Vike's pages answer a method they don't list (e.g. PROPFIND) when there's no +middleware", async () => {
    const response = await universalVikeHandler(new Request('http://localhost/about', { method: 'PROPFIND' }))
    expect(await response.text()).toBe('page')
  })

  it("doesn't merge a +middleware's context into the context it's given, e.g. a Cloudflare worker's `env` shared by all requests", async () => {
    app.withUserMiddleware = true
    const env = {}
    const first = await universalVikeHandler(new Request('http://localhost/', { headers: { 'x-user': '1' } }), env)
    const second = await universalVikeHandler(new Request('http://localhost/'), env)
    expect([await first.text(), await second.text(), env]).toEqual(['page alice', 'page', {}])
    app.withUserMiddleware = false
  })
})
