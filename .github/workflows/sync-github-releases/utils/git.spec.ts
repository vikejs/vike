import { describe, expect, it } from 'vitest'
import { toPackageDirs } from './git.ts'

describe('toPackageDirs()', () => {
  it('maps changed CHANGELOG.md files to deduplicated package directories', () => {
    expect(
      toPackageDirs([
        'packages/foo/CHANGELOG.md',
        'packages/foo/src/index.ts',
        'packages/bar/CHANGELOG.md',
        'packages/bar/CHANGELOG.md',
      ]),
    ).toEqual(['packages/foo', 'packages/bar'])
  })

  it('ignores CHANGELOG.md files outside packages/ and non-CHANGELOG files', () => {
    expect(
      toPackageDirs(['CHANGELOG.md', 'docs/CHANGELOG.md', 'packages/foo/README.md', 'packages/foo/CHANGELOG.md']),
    ).toEqual(['packages/foo'])
  })

  it('returns an empty array when nothing matches', () => {
    expect(toPackageDirs(['README.md', 'packages/foo/src/index.ts'])).toEqual([])
  })
})
