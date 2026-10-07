import { describe, it, expect } from 'vitest'
import { isDistServerRemoved } from './resolvePrerenderConfig.js'

type VikeConfig = Parameters<typeof isDistServerRemoved>[1]
const getVikeConfig = (configValueSources: Record<string, unknown[]> = {}) =>
  ({ _pageConfigGlobal: { configValueSources } }) as unknown as VikeConfig

describe('isDistServerRemoved()', () => {
  it('removes dist/server/ if all pages are pre-rendered', () => {
    const vikeConfig = getVikeConfig()
    expect(isDistServerRemoved({ isPrerenderingEnabledForAllPages: true, keepDistServer: false }, vikeConfig)).toBe(
      true,
    )
    expect(isDistServerRemoved({ isPrerenderingEnabledForAllPages: false, keepDistServer: false }, vikeConfig)).toBe(
      false,
    )
    // https://vike.dev/prerender#keepDistServer
    expect(isDistServerRemoved({ isPrerenderingEnabledForAllPages: true, keepDistServer: true }, vikeConfig)).toBe(
      false,
    )
  })

  it('keeps dist/server/ if +serverEntry is defined', () => {
    // dist/server/index.mjs is the user's server entry
    const vikeConfig = getVikeConfig({ serverEntry: [{}] })
    expect(isDistServerRemoved({ isPrerenderingEnabledForAllPages: true, keepDistServer: false }, vikeConfig)).toBe(
      false,
    )
  })
})
