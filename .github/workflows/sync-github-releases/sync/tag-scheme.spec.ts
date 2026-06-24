import { describe, expect, it } from 'vitest'
import { getTagScheme } from './tag-scheme.ts'

describe('getTagScheme()', () => {
  it('keeps the bare vX.Y.Z tag for a single package, and owns only such tags', () => {
    const scheme = getTagScheme('vike', false)
    expect(scheme.build('0.4.259')).toBe('v0.4.259')
    expect(scheme.build('0.1.0-beta.6')).toBe('v0.1.0-beta.6')
    expect(scheme.owns('v0.4.259')).toBe(true)
    expect(scheme.owns('nightly')).toBe(false)
  })

  it('qualifies the tag with the package name when there are several packages, and owns only its own', () => {
    const scheme = getTagScheme('create-vike-core', true)
    expect(scheme.build('0.0.391')).toBe('create-vike-core@0.0.391')
    expect(scheme.build('0.1.0-beta.6')).toBe('create-vike-core@0.1.0-beta.6')
    expect(scheme.owns('create-vike-core@0.0.391')).toBe(true)
    expect(scheme.owns('vike@0.4.0')).toBe(false)
  })
})
