import { describe, expect, it } from 'vitest'
import { toPackageDirs } from './git.ts'

describe('toPackageDirs()', () => {
  it('maps changed CHANGELOG.md files to deduplicated package directories', () => {
    expect(
      toPackageDirs([
        'packages/vike/CHANGELOG.md',
        'packages/vike/src/index.ts',
        'packages/create-vike-core/CHANGELOG.md',
        'packages/create-vike-core/CHANGELOG.md',
      ]),
    ).toEqual(['packages/vike', 'packages/create-vike-core'])
  })

  it('maps a CHANGELOG.md to its directory wherever it lives (root, nested) and skips non-CHANGELOG files', () => {
    expect(
      toPackageDirs(['CHANGELOG.md', 'docs/CHANGELOG.md', 'packages/vike/README.md', 'packages/vike/CHANGELOG.md']),
    ).toEqual(['.', 'docs', 'packages/vike'])
  })

  it('returns an empty array when nothing matches', () => {
    expect(toPackageDirs(['README.md', 'packages/vike/src/index.ts'])).toEqual([])
  })
})
