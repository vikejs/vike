import { describe, expect, it, vi } from 'vitest'
import { decideTargetCommitish } from './target-commitish.ts'

describe('decideTargetCommitish()', () => {
  const base = { releaseTag: 'v0.4.0', defaultBranch: 'main' }

  it('uses the default branch when the tag already exists (GitHub ignores it)', () => {
    expect(decideTargetCommitish({ ...base, tagExists: true, isLatest: false, deduceCommit: () => null })).toBe('main')
    // Even for the latest release, an existing tag is fine.
    expect(decideTargetCommitish({ ...base, tagExists: true, isLatest: true, deduceCommit: () => null })).toBe('main')
  })

  it('hard-fails when the latest release has no tag', () => {
    expect(() =>
      decideTargetCommitish({ ...base, tagExists: false, isLatest: true, deduceCommit: () => null }),
    ).toThrow(/latest release must already be tagged/)
  })

  it('tags an older release at the deduced commit', () => {
    expect(decideTargetCommitish({ ...base, tagExists: false, isLatest: false, deduceCommit: () => 'abc123' })).toBe(
      'abc123',
    )
  })

  it('hard-fails when an older release has no tag and no deducible commit', () => {
    expect(() =>
      decideTargetCommitish({ ...base, tagExists: false, isLatest: false, deduceCommit: () => null }),
    ).toThrow(/couldn't be deduced/)
  })

  it('only deduces the commit for a backfilled older release (never when the tag exists or it is latest)', () => {
    const deduceCommit = vi.fn(() => 'abc123')
    decideTargetCommitish({ ...base, tagExists: true, isLatest: false, deduceCommit })
    expect(() => decideTargetCommitish({ ...base, tagExists: false, isLatest: true, deduceCommit })).toThrow()
    expect(deduceCommit).not.toHaveBeenCalled()

    decideTargetCommitish({ ...base, tagExists: false, isLatest: false, deduceCommit })
    expect(deduceCommit).toHaveBeenCalledOnce()
  })
})
