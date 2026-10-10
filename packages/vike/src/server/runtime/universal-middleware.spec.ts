import { describe, it, expect, vi } from 'vitest'
import universalVikeHandler from './universal-middleware.js'

// A stand-in for Vike's pages, so that no app is needed
vi.mock('./middlewares.js', async () => {
  const { enhance } = await import('@universal-middleware/core')
  const pages = enhance(() => new Response('page'), { name: 'vike', method: 'GET', path: '/**' })
  return { getAppMiddlewares: async () => [Object.assign(pages, { isHandler: true })] }
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
})
