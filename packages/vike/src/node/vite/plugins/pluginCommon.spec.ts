import { describe, expect, it } from 'vitest'
import type { ResolvedConfig } from 'vite'
import { assertRuntimeEnvironmentsExist } from './pluginCommon.js'

describe('assertRuntimeEnvironmentsExist()', () => {
  const environments = { client: {}, ssr: {}, rsc: {} } as unknown as ResolvedConfig['environments']
  it('does not require Vite environments for the server and client environments', () => {
    expect(() =>
      assertRuntimeEnvironmentsExist(['server', 'client'], {} as ResolvedConfig['environments']),
    ).not.toThrow()
  })
  it('requires a Vite environment of the same name for other environments', () => {
    expect(() => assertRuntimeEnvironmentsExist(['server', 'client', 'rsc'], environments)).not.toThrow()
    expect(() => assertRuntimeEnvironmentsExist(['server', 'client', 'worker'], environments)).toThrow(
      "doesn't exist in",
    )
  })
})
