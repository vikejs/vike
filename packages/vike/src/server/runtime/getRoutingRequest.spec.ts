import { describe, it, expect, vi } from 'vitest'
import { enhance } from '@universal-middleware/core'
import { assertMiddlewarePath } from './getRoutingRequest.js'

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
