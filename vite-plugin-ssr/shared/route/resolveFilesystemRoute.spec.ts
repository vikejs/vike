import { getFilesystemRoute } from './resolveFilesystemRoute'
import { expect, describe, it } from 'vitest'

describe('getFilesystemRoute', () => {
  it('basics', () => {
    let p1 = '/pages/index'
    expect(getFilesystemRoute(p1, [], [p1])).toBe('/')
    p1 = '/pages/index/index'
    expect(getFilesystemRoute(p1, [], [p1])).toBe('/')

    const p2 = '/pages/about'
    expect(getFilesystemRoute(p2, [], [p2, p1])).toBe('/about')

    const p3 = '/pages/contact/index'
    expect(getFilesystemRoute(p3, [], [p3, p2, p1])).toBe('/contact')
    expect(getFilesystemRoute(p3, [], [p3, p2])).toBe('/contact')
    expect(getFilesystemRoute(p3, [], [p3])).toBe('/contact')
  })

  it('common directory', () => {
    let p = '/demo/pages/about/index'
    expect(getFilesystemRoute(p, [], ['/demo/pages/index/index', p])).toBe('/about')
    expect(getFilesystemRoute(p, [], [p])).toBe('/about')
  })

  it('ignored directories', () => {
    let p = '/src/pages/index/index'
    expect(getFilesystemRoute(p, [], [p])).toBe('/')
    p = '/src/pages/about/index'
    expect(getFilesystemRoute(p, [], [p])).toBe('/about')
    expect(getFilesystemRoute(p, [], [p, '/src/pages/hello'])).toBe('/about')
  })

  it('filesystem roots', () => {
    // prettier-ignore
    const pS = [
      '/pages/admin/index/index',
      '/pages/admin/login/index',
      '/pages/index/index',
      '/pages/about/index',
    ]
    expect(getFilesystemRoute(pS[0], [], pS)).toBe('/admin')
    expect(getFilesystemRoute(pS[1], [], pS)).toBe('/admin/login')
    expect(getFilesystemRoute(pS[3], [], pS)).toBe('/about')
    const fsRoot = { filesystemRoot: '/pages/admin', routeRoot: '/_admin' }
    expect(getFilesystemRoute(pS[0], [fsRoot], pS)).toBe('/_admin')
    expect(getFilesystemRoute(pS[1], [fsRoot], pS)).toBe('/_admin/login')
    expect(getFilesystemRoute(pS[3], [fsRoot], pS)).toBe('/about')
  })

  it('domain-driven file structure', () => {
    // prettier-ignore
    const pS = [
      '/product/pages/index',
      '/product/pages/@id',
      '/auth/pages/index/index',
      '/auth/pages/login/index',
      '/marketing/pages/index/index',
      '/marketing/pages/about/index',
    ]
    const fsRoot = { filesystemRoot: '/marketing/pages', routeRoot: '/' }
    expect(getFilesystemRoute(pS[0], [fsRoot], pS)).toBe('/product')
    expect(getFilesystemRoute(pS[1], [fsRoot], pS)).toBe('/product/@id')
    expect(getFilesystemRoute(pS[2], [fsRoot], pS)).toBe('/auth')
    expect(getFilesystemRoute(pS[3], [fsRoot], pS)).toBe('/auth/login')
    expect(getFilesystemRoute(pS[4], [fsRoot], pS)).toBe('/')
    expect(getFilesystemRoute(pS[5], [fsRoot], pS)).toBe('/about')
  })

  it('all features', () => {
    let p1 = '/src/product/src/pages/@id'
    let p2 = '/src/auth/src/pages/index'
    expect(getFilesystemRoute(p1, [], [p1, p2])).toBe('/product/@id')
    expect(getFilesystemRoute(p2, [], [p1, p2])).toBe('/auth')
  })
})
