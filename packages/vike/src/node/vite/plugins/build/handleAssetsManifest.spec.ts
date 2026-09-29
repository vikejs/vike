import { expect, describe, it } from 'vitest'
import { getPageId } from './handleAssetsManifest.js'

describe('getPageId()', () => {
  it('Vike page entries', () => {
    expect(getPageId('virtual:vike:page-entry:client:/pages/index')).toBe('/pages/index')
    expect(getPageId('virtual:vike:page-entry:server:/pages/about')).toBe('/pages/about')
    expect(getPageId('../../virtual:vike:page-entry:client:/pages/index')).toBe('/pages/index')
    expect(getPageId('../api/virtual:vike:page-entry:client:/pages/index')).toBe('/pages/index')
    expect(getPageId('../tools:api/virtual:vike:page-entry:client:/pages/index')).toBe('/pages/index')
  })
  it('other modules', () => {
    expect(getPageId('pages/index/+Page.tsx')).toBe(null)
    expect(getPageId('virtual:vike:global-entry:client:client-routing')).toBe(null)
    // Created by @vitejs/plugin-rsc
    expect(
      getPageId('virtual:vite-rsc/client-references/group/facade:virtual:vike:page-entry:server:/pages/index'),
    ).toBe(null)
  })
})
