import { describe, it, expect, vi, beforeEach } from 'vitest'

// The state is shared across module instances: start every test from a state where nothing was fetched
const freshModule = async () => {
  delete (globalThis as any)._vike?.globals?.['runtime/plusMiddlewareChange.ts']
  vi.resetModules()
  return await import('./plusMiddlewareChange.js')
}

describe('plusMiddlewareChange', () => {
  const a = () => {}
  const b = () => {}
  let module: Awaited<ReturnType<typeof freshModule>>
  const listener = vi.fn()
  beforeEach(async () => {
    listener.mockClear()
    module = await freshModule()
    module.onPlusMiddlewareChange(listener)
  })

  it("doesn't notify if the list wasn't fetched: a server that doesn't apply it has nothing to re-run", () => {
    module.notifyPlusMiddlewareChange([a])
    expect(listener).not.toHaveBeenCalled()
  })

  it("doesn't notify if the +middleware are the ones of the fetched list", () => {
    module.setPlusMiddlewareFetched([a, b])
    module.notifyPlusMiddlewareChange([a, b])
    expect(listener).not.toHaveBeenCalled()
  })

  it.each([
    ['added', [a, b]],
    ['removed', []],
    ['edited', [b]],
    ['re-ordered', [b, a]],
  ])('notifies once if a +middleware is %s, until the list is fetched again', (_, plusMiddlewares) => {
    module.setPlusMiddlewareFetched([a])
    module.notifyPlusMiddlewareChange(plusMiddlewares)
    module.notifyPlusMiddlewareChange(plusMiddlewares)
    expect(listener).toHaveBeenCalledTimes(1)
    module.setPlusMiddlewareFetched(plusMiddlewares)
    module.notifyPlusMiddlewareChange([a, b, a])
    expect(listener).toHaveBeenCalledTimes(2)
  })

  it('notifies once the config is fixed, if the list was fetched while it was erroneous', () => {
    module.setPlusMiddlewareFetched(null)
    module.notifyPlusMiddlewareChange([])
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('stops notifying a listener that was removed', () => {
    const other = vi.fn()
    const remove = module.onPlusMiddlewareChange(other)
    remove()
    module.setPlusMiddlewareFetched([])
    module.notifyPlusMiddlewareChange([a])
    expect(listener).toHaveBeenCalledTimes(1)
    expect(other).not.toHaveBeenCalled()
  })
})
