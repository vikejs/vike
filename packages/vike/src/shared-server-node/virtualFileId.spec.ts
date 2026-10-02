import { describe, expect, it } from 'vitest'
import {
  generateVirtualFileId,
  generateVirtualFileIdAdditionalEnvironment,
  parseVirtualFileId,
} from './virtualFileId.js'

describe('named virtual file IDs', () => {
  it('keeps published client/server IDs unchanged', () => {
    expect(generateVirtualFileId({ type: 'page-entry', pageId: '/some-page', environmentName: 'client' })).toBe(
      'virtual:vike:page-entry:client:/some-page',
    )
    expect(generateVirtualFileId({ type: 'page-entry', pageId: '/some-page', environmentName: 'server' })).toBe(
      'virtual:vike:page-entry:server:/some-page',
    )
    expect(generateVirtualFileId({ type: 'global-entry', environmentName: 'server' })).toBe(
      'virtual:vike:global-entry:server',
    )
    expect(generateVirtualFileId({ type: 'global-entry', environmentName: 'client' })).toBe(
      'virtual:vike:global-entry:client:server-routing',
    )
    expect(generateVirtualFileId({ type: 'global-entry', environmentName: 'client', isClientRouting: true })).toBe(
      'virtual:vike:global-entry:client:client-routing',
    )
  })

  it('round-trips an exact named page-entry identity', () => {
    const id = generateVirtualFileId({ type: 'page-entry', environmentName: 'worker', pageId: '/some-page' })
    expect(id).toBe('virtual:vike:page-entry:worker:/some-page')
    expect(parseVirtualFileId(id)).toStrictEqual({
      type: 'page-entry',
      environmentName: 'worker',
      pageId: '/some-page',
      isExtractAssets: false,
    })
  })

  it('preserves ROOT serialization for named page entries', () => {
    const id = generateVirtualFileId({ type: 'page-entry', environmentName: 'worker', pageId: '/' })
    expect(id).toBe('virtual:vike:page-entry:worker:ROOT')
    expect(parseVirtualFileId(id)).toMatchObject({ environmentName: 'worker', pageId: '/' })
  })

  it('round-trips named global IDs', () => {
    const globalId = generateVirtualFileId({ type: 'global-entry', environmentName: 'worker' })
    expect(globalId).toBe('virtual:vike:global-entry:worker')
    expect(parseVirtualFileId(globalId)).toStrictEqual({
      type: 'global-entry',
      environmentName: 'worker',
      isClientRouting: false,
    })
  })

  it('generates the global ID of an additional environment', () => {
    expect(generateVirtualFileIdAdditionalEnvironment('rsc')).toBe('virtual:vike:global-entry:rsc')
    expect(() => generateVirtualFileIdAdditionalEnvironment('server')).toThrow()
    expect(() => generateVirtualFileIdAdditionalEnvironment('client')).toThrow()
  })
})
