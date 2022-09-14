import { getFilesystemRouteString } from './getFilesystemRouteString'
import { expect, describe, it } from 'vitest'

describe('getFilesystemRouteString', () => {
  it('basics', () => {
    let p1 = '/pages/index'
    expect(getFilesystemRouteString(p1, [])).toBe('/')
    p1 = '/pages/index/index'
    expect(getFilesystemRouteString(p1, [])).toBe('/')

    const p2 = '/pages/about'
    expect(getFilesystemRouteString(p2, [])).toBe('/about')

    const p3 = '/pages/contact/index'
    expect(getFilesystemRouteString(p3, [])).toBe('/contact')
    expect(getFilesystemRouteString(p3, [])).toBe('/contact')
    expect(getFilesystemRouteString(p3, [])).toBe('/contact')
  })

  it('ignored directories', () => {
    let p = '/src/pages/index/index'
    expect(getFilesystemRouteString(p, [])).toBe('/')
    p = '/src/pages/about/index'
    expect(getFilesystemRouteString(p, [])).toBe('/about')
    expect(getFilesystemRouteString(p, [])).toBe('/about')
  })

  it('filesystem roots', () => {
    // prettier-ignore
    const pS = [
      '/pages/admin/index/index',
      '/pages/admin/login/index',
      '/pages/index/index',
      '/pages/about/index',
    ]
    expect(getFilesystemRouteString(pS[0], [])).toBe('/admin')
    expect(getFilesystemRouteString(pS[1], [])).toBe('/admin/login')
    expect(getFilesystemRouteString(pS[3], [])).toBe('/about')
    const fsRoot = { filesystemRoot: '/pages/admin', routeRoot: '/_admin' }
    expect(getFilesystemRouteString(pS[0], [fsRoot])).toBe('/_admin')
    expect(getFilesystemRouteString(pS[1], [fsRoot])).toBe('/_admin/login')
    expect(getFilesystemRouteString(pS[3], [fsRoot])).toBe('/about')
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
    expect(getFilesystemRouteString(pS[0], [fsRoot])).toBe('/product')
    expect(getFilesystemRouteString(pS[1], [fsRoot])).toBe('/product/@id')
    expect(getFilesystemRouteString(pS[2], [fsRoot])).toBe('/auth')
    expect(getFilesystemRouteString(pS[3], [fsRoot])).toBe('/auth/login')
    expect(getFilesystemRouteString(pS[4], [fsRoot])).toBe('/')
    expect(getFilesystemRouteString(pS[5], [fsRoot])).toBe('/about')
  })

  it('all features', () => {
    let p1 = '/src/product/src/pages/@id'
    let p2 = '/src/auth/src/pages/index'
    expect(getFilesystemRouteString(p1, [])).toBe('/product/@id')
    expect(getFilesystemRouteString(p2, [])).toBe('/auth')
  })
})
