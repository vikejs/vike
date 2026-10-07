import { describe, it, expect, vi } from 'vitest'
import {
  enhance,
  getUniversalProp,
  methodSymbol,
  nameSymbol,
  orderSymbol,
  pathSymbol,
} from '@universal-middleware/core'
import { normalizeMiddlewarePath } from './normalizeMiddlewarePath.js'

const path = (path: string) =>
  getUniversalProp(normalizeMiddlewarePath(enhance(() => undefined, { name: 'test', method: 'GET', path })), pathSymbol)

describe('normalizeMiddlewarePath()', () => {
  it('starts a path with /', () => {
    expect(path('dash')).toBe('/dash')
    expect(path('/dash')).toBe('/dash')
    expect(path('{en/}?users')).toBe('{en/}?users')
  })
  it('keeps a middleware without a path', () => {
    const middleware = enhance(() => undefined, { name: 'test' })
    expect(normalizeMiddlewarePath(middleware)).toBe(middleware)
  })
  it('keeps the other properties when it adds the /', () => {
    const middleware = normalizeMiddlewarePath(
      enhance(() => undefined, { name: 'test', method: 'GET', path: 'dash', order: -900 }),
    )
    expect(getUniversalProp(middleware, pathSymbol)).toBe('/dash')
    expect(getUniversalProp(middleware, nameSymbol)).toBe('test')
    expect(getUniversalProp(middleware, methodSymbol)).toBe('GET')
    expect(getUniversalProp(middleware, orderSymbol)).toBe(-900)
  })
  it('warns about a - right after a parameter name, which now ends the name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    path('/years/:year-:month')
    expect(warn).not.toHaveBeenCalled()
    path('/users/:user-id')
    expect(warn).toHaveBeenCalledTimes(1)
    expect(String(warn.mock.calls[0]![0])).toContain(':userId instead of :user-id')
    warn.mockRestore()
  })
})
