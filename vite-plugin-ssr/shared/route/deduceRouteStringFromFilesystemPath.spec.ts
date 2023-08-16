import { deduceRouteStringFromFilesystemPath } from './deduceRouteStringFromFilesystemPath.js'
import { expect, describe, it } from 'vitest'

describe('deduceRouteStringFromFilesystemPath', () => {
  it('basics', () => {
    let p1 = '/pages/index'
    expect(deduceRouteStringFromFilesystemPath(p1, [])).toBe('/')
    p1 = '/pages/index/index'
    expect(deduceRouteStringFromFilesystemPath(p1, [])).toBe('/')

    const p2 = '/pages/about'
    expect(deduceRouteStringFromFilesystemPath(p2, [])).toBe('/about')

    const p3 = '/pages/contact/index'
    expect(deduceRouteStringFromFilesystemPath(p3, [])).toBe('/contact')
    expect(deduceRouteStringFromFilesystemPath(p3, [])).toBe('/contact')
    expect(deduceRouteStringFromFilesystemPath(p3, [])).toBe('/contact')
  })

  it('ignored directories', () => {
    let p = '/src/pages/index/index'
    expect(deduceRouteStringFromFilesystemPath(p, [])).toBe('/')
    p = '/src/pages/about/index'
    expect(deduceRouteStringFromFilesystemPath(p, [])).toBe('/about')
    expect(deduceRouteStringFromFilesystemPath(p, [])).toBe('/about')
  })

  it('filesystem roots', () => {
    // prettier-ignore
    const pS = [
      '/pages/admin/index/index',
      '/pages/admin/login/index',
      '/pages/index/index',
      '/pages/about/index',
    ]
    expect(deduceRouteStringFromFilesystemPath(pS[0]!, [])).toBe('/admin')
    expect(deduceRouteStringFromFilesystemPath(pS[1]!, [])).toBe('/admin/login')
    expect(deduceRouteStringFromFilesystemPath(pS[3]!, [])).toBe('/about')
    const fsBase = { filesystemRoot: '/pages/admin', urlRoot: '/_admin' }
    expect(deduceRouteStringFromFilesystemPath(pS[0]!, [fsBase])).toBe('/_admin')
    expect(deduceRouteStringFromFilesystemPath(pS[1]!, [fsBase])).toBe('/_admin/login')
    expect(deduceRouteStringFromFilesystemPath(pS[3]!, [fsBase])).toBe('/about')
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
    const fsBase = { filesystemRoot: '/marketing/pages', urlRoot: '/' }
    expect(deduceRouteStringFromFilesystemPath(pS[0]!, [fsBase])).toBe('/product')
    expect(deduceRouteStringFromFilesystemPath(pS[1]!, [fsBase])).toBe('/product/@id')
    expect(deduceRouteStringFromFilesystemPath(pS[2]!, [fsBase])).toBe('/auth')
    expect(deduceRouteStringFromFilesystemPath(pS[3]!, [fsBase])).toBe('/auth/login')
    expect(deduceRouteStringFromFilesystemPath(pS[4]!, [fsBase])).toBe('/')
    expect(deduceRouteStringFromFilesystemPath(pS[5]!, [fsBase])).toBe('/about')
  })

  it('all features', () => {
    let p1 = '/src/product/src/pages/@id'
    let p2 = '/src/auth/src/pages/index'
    expect(deduceRouteStringFromFilesystemPath(p1, [])).toBe('/product/@id')
    expect(deduceRouteStringFromFilesystemPath(p2, [])).toBe('/auth')
  })
})
