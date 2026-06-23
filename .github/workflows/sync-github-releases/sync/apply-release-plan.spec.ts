import { describe, expect, it, vi } from 'vitest'
import { applyReleasePlan, resolveTargetCommitish } from './apply-release-plan.ts'
import type { ReleasePlan } from './release-plan.ts'
import type { Release, ReleasesClient } from '../utils/github.ts'

describe('resolveTargetCommitish()', () => {
  const base = { releaseTag: 'v0.4.0', defaultBranch: 'main' }

  it('uses the default branch when the tag already exists (GitHub ignores it)', () => {
    expect(resolveTargetCommitish({ ...base, tagExists: true, isLatest: false, deduceCommit: () => null })).toBe('main')
    // Even for the latest release, an existing tag is fine.
    expect(resolveTargetCommitish({ ...base, tagExists: true, isLatest: true, deduceCommit: () => null })).toBe('main')
  })

  it('hard-fails when the latest release has no tag', () => {
    expect(() =>
      resolveTargetCommitish({ ...base, tagExists: false, isLatest: true, deduceCommit: () => null }),
    ).toThrow(/latest release must already be tagged/)
  })

  it('tags an older release at the deduced commit', () => {
    expect(resolveTargetCommitish({ ...base, tagExists: false, isLatest: false, deduceCommit: () => 'abc123' })).toBe(
      'abc123',
    )
  })

  it('hard-fails when an older release has no tag and no deducible commit', () => {
    expect(() =>
      resolveTargetCommitish({ ...base, tagExists: false, isLatest: false, deduceCommit: () => null }),
    ).toThrow(/couldn't be deduced/)
  })

  it('only deduces the commit for a backfilled older release (never when the tag exists or it is latest)', () => {
    const deduceCommit = vi.fn(() => 'abc123')
    resolveTargetCommitish({ ...base, tagExists: true, isLatest: false, deduceCommit })
    expect(() => resolveTargetCommitish({ ...base, tagExists: false, isLatest: true, deduceCommit })).toThrow()
    expect(deduceCommit).not.toHaveBeenCalled()

    resolveTargetCommitish({ ...base, tagExists: false, isLatest: false, deduceCommit })
    expect(deduceCommit).toHaveBeenCalledOnce()
  })
})

describe('applyReleasePlan()', () => {
  // No creates in the plan, so resolveCreateTarget() (which shells out to git) isn't exercised here.
  // The dry-run gate is shared by all three actions via applyWrite(), so update + delete prove it.
  const plan: ReleasePlan = {
    releasesToCreate: [],
    releasesToUpdate: [{ release_id: 1, tag_name: 'v1.0.0', body: 'Fresh notes' }],
    releasesToDelete: [{ release_id: 2, tag_name: 'v0.9.0' }],
  }

  function createFakeClient(): { client: ReleasesClient; calls: string[] } {
    const calls: string[] = []
    const client: ReleasesClient = {
      async list() {
        return [] as Release[]
      },
      async create() {
        calls.push('create')
      },
      async update(releaseId) {
        calls.push(`update:${releaseId}`)
      },
      async delete(releaseId) {
        calls.push(`delete:${releaseId}`)
      },
    }
    return { client, calls }
  }

  it('performs each write and logs it', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const { client, calls } = createFakeClient()

    await applyReleasePlan(plan, client, 'main', false)

    expect(calls).toEqual(['update:1', 'delete:2'])
    expect(log.mock.calls.flat()).toEqual(['Updated release v1.0.0', 'Deleted release v0.9.0'])
    log.mockRestore()
  })

  it('under --dry-run, announces every action but performs no write', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const { client, calls } = createFakeClient()

    await applyReleasePlan(plan, client, 'main', true)

    expect(calls).toEqual([])
    expect(log.mock.calls.flat()).toEqual([
      '[dry-run] Would update release v1.0.0',
      '[dry-run] Would delete release v0.9.0',
    ])
    log.mockRestore()
  })
})
