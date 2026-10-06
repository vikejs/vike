import { describe, it, expect } from 'vitest'
import { enhance, getUniversalProp, pathSymbol } from '@universal-middleware/core'
import { addUrlForms } from './addUrlForms.js'

const paths = (path: string | undefined, baseServer = '/') => {
  const middleware = enhance(() => undefined, { name: 'test', method: 'GET', ...(path && { path }) })
  return addUrlForms(middleware, baseServer).map((m) => getUniversalProp(m, pathSymbol))
}

describe('addUrlForms()', () => {
  it('adds the .pageContext.json twin of a path', () => {
    expect(paths('/dash')).toEqual(['/dash', '/dash/index.pageContext.json'])
    expect(paths('/dash/')).toEqual(['/dash/', '/dash/index.pageContext.json'])
    expect(paths('/')).toEqual(['/', '/index.pageContext.json'])
    expect(paths('/users/:id')).toEqual(['/users/:id', '/users/:id/index.pageContext.json'])
  })
  it('adds the path with the Base URL', () => {
    expect(paths('/dash', '/app/')).toEqual([
      '/dash',
      '/dash/index.pageContext.json',
      '/app/dash',
      '/app/dash/index.pageContext.json',
    ])
  })
  it('keeps /** as is', () => {
    expect(paths('/dash/**')).toEqual(['/dash/**'])
    expect(paths('/dash/**', '/app')).toEqual(['/dash/**', '/app/dash/**'])
  })
  it('keeps the other properties', () => {
    const middleware = enhance(() => undefined, { name: 'test', method: 'GET', path: '/dash', order: -900 })
    for (const m of addUrlForms(middleware, '/')) {
      expect(getUniversalProp(m, Symbol.for('unName'))).toBe('test')
      expect(getUniversalProp(m, Symbol.for('unMethod'))).toBe('GET')
      expect(getUniversalProp(m, Symbol.for('unOrder'))).toBe(-900)
    }
  })
  it('keeps a middleware without a path', () => {
    expect(paths(undefined)).toEqual([undefined])
  })
})
