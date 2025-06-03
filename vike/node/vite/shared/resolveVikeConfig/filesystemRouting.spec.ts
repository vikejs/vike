import {
  getLocationId,
  isInherited as isInherited_,
  getLogicalPath as getLogicalPath_,
  type LocationId
} from './filesystemRouting.js'
import { expect, describe, it } from 'vitest'

describe('getLocationId()', () => {
  it('works', () => {
    expect(getLocationId('/pages/some-page/+Page.js')).toBe('/pages/some-page')
    expect(getLocationId('/renderer/+config.js')).toBe('/renderer')
  })
})

describe('isInherited()', () => {
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

describe('getLogicalPath()', () => {
  it('works', () => {
    expect(getLogicalPath('/pages/some-page', ['pages'])).toBe('/some-page')
  })
})

function isInherited(l1: string, l2: string) {
  return isInherited_(l1 as LocationId, l2 as LocationId)
}
function getLogicalPath(l: string, a: string[]) {
  return getLogicalPath_(l as LocationId, a)
}
