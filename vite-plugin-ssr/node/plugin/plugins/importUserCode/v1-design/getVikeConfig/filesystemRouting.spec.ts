import { getLocationId, isInherited, getLogicalPath } from './filesystemRouting.js'
import { expect, describe, it } from 'vitest'

describe('isInherited', () => {
  it('works', () => {
    expect(isInherited('/pages/about', '/pages/product')).toBe(false)
    expect(isInherited('/pages/about', '/pages/about/team')).toBe(true)
    expect(isInherited('/pages/about/us', '/pages/about/team')).toBe(false)
    expect(isInherited('/pages/about', '/pages/about2')).toBe(false)
    expect(isInherited('/pages/about', '/pages/about-us')).toBe(false)
    expect(isInherited('/pages/about', '/pages/about')).toBe(true)
    expect(isInherited('/pages', '/pages/about')).toBe(true)
    expect(isInherited('/renderer', '/pages/about')).toBe(true)
  })
})

describe('getLocationId', () => {
  it('works', () => {
    expect(getLocationId('/pages/some-page/+Page.js')).toBe('/pages/some-page')
    expect(getLocationId('/pages/some-page')).toBe('/pages/some-page')
    expect(getLocationId('/renderer/+config.js')).toBe('/renderer')
  })
})

describe('getLocationId', () => {
  it('works', () => {
    expect(getLogicalPath('/pages/some-page', ['pages'])).toBe('/some-page')
    expect(getLogicalPath('some-npm-pkg/renderer', ['renderer'])).toBe('/')
  })
})
