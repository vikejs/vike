import { describe, expect, it } from 'vitest'
import { resolveTargetCommitish, getReleasePlan, getTagScheme } from './release-plan.ts'

describe('getReleasePlan()', () => {
  it('creates missing past releases alongside the current release and updates stale notes', () => {
    const plan = getReleasePlan({
      packageName: 'vike',
      hasMultiplePackages: false,
      releaseNotesByVersion: {
        '1.0.1': 'New release notes',
        '1.0.0': 'Updated old notes',
        '0.9.0': 'Existing notes',
        '0.8.0': 'Missing past notes',
      },
      githubReleases: [
        { id: 1, tag_name: 'v1.0.0', body: 'Outdated old notes' },
        { id: 2, tag_name: 'v0.9.0', body: 'Existing notes' },
      ],
    })

    expect(plan).toEqual({
      // Oldest-first, and only the newest version is flagged isLatest.
      releasesToCreate: [
        { tag_name: 'v0.8.0', body: 'Missing past notes', version: '0.8.0', isLatest: false },
        { tag_name: 'v1.0.1', body: 'New release notes', version: '1.0.1', isLatest: true },
      ],
      releasesToUpdate: [{ release_id: 1, tag_name: 'v1.0.0', body: 'Updated old notes' }],
      releasesToDelete: [],
    })
  })

  it('updates the current release instead of creating a duplicate', () => {
    const plan = getReleasePlan({
      packageName: 'vike',
      hasMultiplePackages: false,
      releaseNotesByVersion: {
        '1.0.1': 'Fresh release notes',
      },
      githubReleases: [{ id: 3, tag_name: 'v1.0.1', body: 'Stale release notes' }],
    })

    expect(plan).toEqual({
      releasesToCreate: [],
      releasesToUpdate: [{ release_id: 3, tag_name: 'v1.0.1', body: 'Fresh release notes' }],
      releasesToDelete: [],
    })
  })

  it('leaves releases we do not own untouched (no spurious update or delete)', () => {
    const plan = getReleasePlan({
      packageName: 'vike',
      hasMultiplePackages: false,
      releaseNotesByVersion: { '1.0.0': 'Notes' },
      githubReleases: [
        { id: 1, tag_name: 'v1.0.0', body: 'Notes' },
        // Not one of our vX.Y.Z tags: must not be updated (no undefined body) nor deleted.
        { id: 2, tag_name: 'nightly', body: 'Unrelated release' },
      ],
    })

    expect(plan).toEqual({ releasesToCreate: [], releasesToUpdate: [], releasesToDelete: [] })
  })

  it('deletes a release whose version was removed from the changelog', () => {
    const plan = getReleasePlan({
      packageName: 'vike',
      hasMultiplePackages: false,
      releaseNotesByVersion: { '1.0.0': 'Notes' },
      githubReleases: [
        { id: 1, tag_name: 'v1.0.0', body: 'Notes' },
        // Owned tag, no longer in the changelog → delete.
        { id: 2, tag_name: 'v0.9.0', body: 'Removed from changelog' },
      ],
    })

    expect(plan).toEqual({
      releasesToCreate: [],
      releasesToUpdate: [],
      releasesToDelete: [{ release_id: 2, tag_name: 'v0.9.0' }],
    })
  })

  it('only deletes releases in its own namespace', () => {
    const plan = getReleasePlan({
      packageName: 'create-vike-core',
      hasMultiplePackages: true,
      releaseNotesByVersion: { '0.0.1': 'Notes' },
      githubReleases: [
        { id: 1, tag_name: 'create-vike-core@0.0.1', body: 'Notes' },
        // Another package's release — not ours to delete.
        { id: 2, tag_name: 'vike@0.4.0', body: 'Another package' },
      ],
    })

    expect(plan).toEqual({ releasesToCreate: [], releasesToUpdate: [], releasesToDelete: [] })
  })

  it('qualifies tags with the package name when several packages share the repo', () => {
    const plan = getReleasePlan({
      packageName: 'create-vike-core',
      hasMultiplePackages: true,
      releaseNotesByVersion: {
        '0.0.2': 'New notes',
        '0.0.1': 'Old notes',
      },
      // The existing release is matched by its namespaced tag — no duplicate is created for it, and
      // it isn't confused with another package's bare `v0.0.1` release.
      githubReleases: [{ id: 1, tag_name: 'create-vike-core@0.0.1', body: 'Old notes' }],
    })

    expect(plan).toEqual({
      releasesToCreate: [{ tag_name: 'create-vike-core@0.0.2', body: 'New notes', version: '0.0.2', isLatest: true }],
      releasesToUpdate: [],
      releasesToDelete: [],
    })
  })
})

describe('resolveTargetCommitish()', () => {
  const base = { releaseTag: 'v0.4.0', defaultBranch: 'main' }

  it('uses the default branch when the tag already exists (GitHub ignores it)', () => {
    expect(resolveTargetCommitish({ ...base, tagExists: true, isLatest: false, deducedCommit: null })).toBe('main')
    // Even for the latest release, an existing tag is fine.
    expect(resolveTargetCommitish({ ...base, tagExists: true, isLatest: true, deducedCommit: null })).toBe('main')
  })

  it('hard-fails when the latest release has no tag', () => {
    expect(() => resolveTargetCommitish({ ...base, tagExists: false, isLatest: true, deducedCommit: null })).toThrow(
      /latest release must already be tagged/,
    )
  })

  it('tags an older release at the deduced commit', () => {
    expect(resolveTargetCommitish({ ...base, tagExists: false, isLatest: false, deducedCommit: 'abc123' })).toBe(
      'abc123',
    )
  })

  it('hard-fails when an older release has no tag and no deducible commit', () => {
    expect(() => resolveTargetCommitish({ ...base, tagExists: false, isLatest: false, deducedCommit: null })).toThrow(
      /couldn't be deduced/,
    )
  })
})

describe('getTagScheme()', () => {
  it('keeps the bare vX.Y.Z tag for a single package, and owns only such tags', () => {
    const scheme = getTagScheme('vike', false)
    expect(scheme.build('0.4.259')).toBe('v0.4.259')
    expect(scheme.build('0.1.0-beta.6')).toBe('v0.1.0-beta.6')
    expect(scheme.owns('v0.4.259')).toBe(true)
    // A tag we never create — left untouched.
    expect(scheme.owns('nightly')).toBe(false)
  })

  it('qualifies the tag with the package name when there are several packages, and owns only its own', () => {
    const scheme = getTagScheme('create-vike-core', true)
    expect(scheme.build('0.0.391')).toBe('create-vike-core@0.0.391')
    expect(scheme.build('0.1.0-beta.6')).toBe('create-vike-core@0.1.0-beta.6')
    expect(scheme.owns('create-vike-core@0.0.391')).toBe(true)
    // Another package's release — not ours.
    expect(scheme.owns('vike@0.4.0')).toBe(false)
  })
})
