import { describe, expect, it } from 'vitest'
import { getVikeEnvironmentName, isVikeEnvironmentBuiltIn } from './environmentName.js'

describe('getVikeEnvironmentName()', () => {
  const runtimeEnvironmentNames = ['server', 'client', 'rsc']
  it.each([
    ['ssr', true, 'server'],
    ['client', false, 'client'],
    ['server', true, 'server'],
    // Named by `meta.env`
    ['rsc', true, 'rsc'],
    // Not named by `meta.env` => ordinary projection of its consumer side
    ['worker', true, 'server'],
    ['vercel_node', true, 'server'],
    ['client_legacy', false, 'client'],
  ])('Vite environment %s (server-side: %s) => %s', (viteEnvironmentName, isServerSide, environmentName) => {
    expect(getVikeEnvironmentName(viteEnvironmentName, isServerSide, runtimeEnvironmentNames)).toBe(environmentName)
  })

  it('a named environment is used only if meta.env names it', () => {
    expect(getVikeEnvironmentName('rsc', true, ['server', 'client'])).toBe('server')
  })
})

describe('isVikeEnvironmentBuiltIn()', () => {
  it.each([
    ['server', true],
    ['client', true],
    ['ssr', false],
    ['rsc', false],
  ])('%s => %s', (environmentName, expected) => {
    expect(isVikeEnvironmentBuiltIn(environmentName)).toBe(expected)
  })
})
