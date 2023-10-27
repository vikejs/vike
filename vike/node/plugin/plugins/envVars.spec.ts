import { expect, describe, it } from 'vitest'
import { applyEnvVar } from './envVars.js'

describe('applyEnvVar()', () => {
  it('works', () => {
    expect(applyEnvVar('A', '1', '')).toBe('')
    expect(applyEnvVar('A', '1', 'A')).toBe('A')
    expect(applyEnvVar('A', '1', 'import.meta.env.A')).toBe('"1"')
    expect(applyEnvVar('A', '1', ' import.meta.env.A|')).toBe(' "1"|')
    expect(applyEnvVar('A', '1', 'import.meta.env.AB')).toBe('import.meta.env.AB')
    expect(applyEnvVar('A', '1', 'import.meta.env.A}import.meta.env.A')).toBe('"1"}"1"')
  })
})
