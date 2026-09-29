import { describe, expect, it } from 'vitest'
import { getCode } from './generateVirtualFileRuntime.js'

describe('generateVirtualFileRuntime()', () => {
  const createRuntimeFile = '/vike/dist/runtime/createRuntime.js'

  it('loads the global entry only upon loadPageConfig()', () => {
    const code = getCode('rsc', 'rsc', false, createRuntimeFile, false)
    expect(code).not.toContain('import { pageConfigsSerialized')
    expect(code).toContain('const loadRuntime = () => import("virtual:vike:global-entry:rsc")')
  })

  it('caches the runtime only in production', () => {
    expect(getCode('rsc', 'rsc', false, createRuntimeFile, false)).toContain('runtimePromises.set(')
    expect(getCode('rsc', 'rsc', true, createRuntimeFile, false)).not.toContain('runtimePromises')
  })

  it.each([
    ['server', 'ssr', 'virtual:vike:global-entry:server'],
    ['server', 'worker', 'virtual:vike:global-entry:server'],
    ['rsc', 'rsc', 'virtual:vike:global-entry:rsc'],
  ])('Vike environment %s (Vite environment %s) loads %s', (environmentName, viteEnvironmentName, globalEntryId) => {
    const code = getCode(environmentName, viteEnvironmentName, true, createRuntimeFile, false)
    expect(code).toContain(`export const environmentName = ${JSON.stringify(environmentName)};`)
    expect(code).toContain(`export const viteEnvironmentName = ${JSON.stringify(viteEnvironmentName)};`)
    expect(code).toContain(`import(${JSON.stringify(globalEntryId)})`)
  })

  describe('client environment', () => {
    const clientRouting = 'virtual:vike:global-entry:client:client-routing'
    const serverRouting = 'virtual:vike:global-entry:client:server-routing'
    it('Client Routing => only the client-routing global entry', () => {
      const code = getCode('client', 'client', false, createRuntimeFile, true)
      expect(code).toContain(clientRouting)
      expect(code).not.toContain(serverRouting)
    })
    it('Server Routing => only the server-routing global entry', () => {
      const code = getCode('client', 'client', false, createRuntimeFile, false)
      expect(code).toContain(serverRouting)
      expect(code).not.toContain(clientRouting)
    })
    it('both => the global entry of the page', () => {
      const code = getCode('client', 'client', false, createRuntimeFile, ['/pages/a'])
      expect(code).toContain(clientRouting)
      expect(code).toContain(serverRouting)
      expect(code).toContain('["/pages/a"]')
    })
  })
})
