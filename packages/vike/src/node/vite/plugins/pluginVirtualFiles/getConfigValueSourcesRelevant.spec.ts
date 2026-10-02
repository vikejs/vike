import { describe, expect, it } from 'vitest'
import { isRuntimeEnvMatch } from './getConfigValueSourcesRelevant.js'

describe('isRuntimeEnvMatch()', () => {
  it('matches environment names exactly', () => {
    const configEnv = { server: true, client: true, worker: true, edge: true }
    expect(isRuntimeEnvMatch(configEnv, { environmentName: 'worker', isDev: false })).toBe(true)
    expect(isRuntimeEnvMatch(configEnv, { environmentName: 'edge', isDev: false })).toBe(true)
    expect(isRuntimeEnvMatch(configEnv, { environmentName: 'other', isDev: false })).toBe(false)
  })

  it('preserves client/server matching', () => {
    expect(isRuntimeEnvMatch({ server: true }, { environmentName: 'server', isDev: false })).toBe(true)
    expect(
      isRuntimeEnvMatch({ server: true }, { environmentName: 'client', isClientRouting: true, isDev: false }),
    ).toBe(false)
    expect(
      isRuntimeEnvMatch({ client: true }, { environmentName: 'client', isClientRouting: false, isDev: false }),
    ).toBe(true)
    expect(
      isRuntimeEnvMatch({ client: true, clientRoutingOnly: true }, { environmentName: 'client', isDev: false }),
    ).toBe(false)
  })

  it('does not collapse a named-only config into the server branch', () => {
    const configEnv = { server: false, client: false, worker: true }
    expect(isRuntimeEnvMatch(configEnv, { environmentName: 'worker', isDev: false })).toBe(true)
    expect(isRuntimeEnvMatch(configEnv, { environmentName: 'server', isDev: false })).toBe(false)
    expect(isRuntimeEnvMatch(configEnv, { environmentName: 'client', isClientRouting: true, isDev: false })).toBe(false)
  })
})
