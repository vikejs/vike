import { describe, expect, it } from 'vitest'
import { getCode } from './generateVirtualFileRuntime.js'

describe('generateVirtualFileRuntime()', () => {
  const createRuntimeFile = '/vike/dist/runtime/createRuntime.js'

  it('loads the global entry only upon loadPageConfig()', () => {
    expect(getCode('rsc', 'rsc', false, createRuntimeFile, false)).toBe(
      [
        'import { createLoadPageConfig } from "/vike/dist/runtime/createRuntime.js";',
        'export const environmentName = "rsc";',
        'export const viteEnvironmentName = "rsc";',
        'export const loadPageConfig = createLoadPageConfig(false, () => import("virtual:vike:global-entry:rsc"), false);',
      ].join('\n'),
    )
  })

  it('passes isDev', () => {
    expect(getCode('rsc', 'rsc', true, createRuntimeFile, false)).toContain(
      'createLoadPageConfig(false, () => import("virtual:vike:global-entry:rsc"), true);',
    )
  })

  it.each([
    ['server', 'ssr', 'virtual:vike:global-entry:server'],
    ['server', 'worker', 'virtual:vike:global-entry:server'],
    ['rsc', 'rsc', 'virtual:vike:global-entry:rsc'],
  ])('Vike environment %s (Vite environment %s) loads %s', (environmentName, viteEnvironmentName, globalEntryId) => {
    const code = getCode(environmentName, viteEnvironmentName, true, createRuntimeFile, true)
    expect(code).toContain(`export const environmentName = ${JSON.stringify(environmentName)};`)
    expect(code).toContain(`export const viteEnvironmentName = ${JSON.stringify(viteEnvironmentName)};`)
    expect(code).toContain(`createLoadPageConfig(false, () => import(${JSON.stringify(globalEntryId)}), true);`)
  })

  describe('client environment', () => {
    const clientRouting = 'virtual:vike:global-entry:client:client-routing'
    const serverRouting = 'virtual:vike:global-entry:client:server-routing'
    it('Client Routing => only the client-routing global entry', () => {
      expect(getCode('client', 'client', false, createRuntimeFile, true)).toContain(
        `createLoadPageConfig(true, () => import("${clientRouting}"), false);`,
      )
    })
    it('Server Routing => only the server-routing global entry', () => {
      expect(getCode('client', 'client', false, createRuntimeFile, false)).toContain(
        `createLoadPageConfig(false, () => import("${serverRouting}"), false);`,
      )
    })
    it('both => the global entry of the page', () => {
      expect(getCode('client', 'client', false, createRuntimeFile, ['/pages/a'])).toContain(
        `createLoadPageConfig(["/pages/a"], (isClientRouting) => isClientRouting ? import("${clientRouting}") : import("${serverRouting}"), false);`,
      )
    })
  })
})
