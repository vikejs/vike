import { describe, expect, it } from 'vitest'
import { getCode } from './generateVirtualFileRuntime.js'

describe('generateVirtualFileRuntime()', () => {
  const createRuntimeFile = '/vike/dist/runtime/createRuntime.js'

  it('loads the global entry only upon loadPageConfig()', () => {
    const code = getCode('rsc', 'rsc', false, createRuntimeFile)
    expect(code).not.toContain('import { pageConfigsSerialized')
    expect(code.indexOf('export async function loadPageConfig')).toBeLessThan(
      code.indexOf('import("virtual:vike:global-entry:rsc")'),
    )
  })

  it('caches the runtime only in production', () => {
    expect(getCode('rsc', 'rsc', false, createRuntimeFile)).toContain('if (!runtimePromise) runtimePromise =')
    expect(getCode('rsc', 'rsc', true, createRuntimeFile)).not.toContain('runtimePromise')
  })

  it.each([
    ['server', 'ssr', 'virtual:vike:global-entry:server'],
    ['server', 'worker', 'virtual:vike:global-entry:server'],
    ['client', 'client', 'virtual:vike:global-entry:client:client-routing'],
    ['rsc', 'rsc', 'virtual:vike:global-entry:rsc'],
  ])('Vike environment %s (Vite environment %s) loads %s', (environmentName, viteEnvironmentName, globalEntryId) => {
    const code = getCode(environmentName, viteEnvironmentName, true, createRuntimeFile)
    expect(code).toContain(`export const environmentName = ${JSON.stringify(environmentName)};`)
    expect(code).toContain(`export const viteEnvironmentName = ${JSON.stringify(viteEnvironmentName)};`)
    expect(code).toContain(`import(${JSON.stringify(globalEntryId)})`)
  })
})
