import { describe, it, expect, vi } from 'vitest'

const withMiddleware = { config: { middleware: [[() => undefined]] } } as any
const withoutMiddleware = { config: {} } as any

async function load() {
  vi.resetModules()
  return await import('./assertPlusMiddlewareInstalled.js')
}

describe('assertPlusMiddlewareInstalled()', () => {
  it('throws when there are +middleware and they were never installed', async () => {
    const { assertPlusMiddlewareInstalled } = await load()
    expect(() => assertPlusMiddlewareInstalled(withMiddleware)).toThrow("Your +middleware aren't applied")
  })
  it('is fine without +middleware', async () => {
    const { assertPlusMiddlewareInstalled } = await load()
    expect(() => assertPlusMiddlewareInstalled(withoutMiddleware)).not.toThrow()
  })
  it('is fine once the chain of +middleware ran', async () => {
    const { assertPlusMiddlewareInstalled, setPlusMiddlewareInstalled } = await load()
    setPlusMiddlewareInstalled()
    expect(() => assertPlusMiddlewareInstalled(withMiddleware)).not.toThrow()
  })
})
