import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { getRepository } from './github-utils.ts'
import { getReleasePlan, getTagName, parseChangelog, toPackageDirs } from './index.ts'

function readFixture(name: string): string {
  return readFileSync(path.join(__dirname, 'fixtures', name), 'utf8')
}

function withEnvUnset(name: string, fn: () => void): void {
  const previous = process.env[name]
  try {
    delete process.env[name]
    fn()
  } finally {
    if (previous === undefined) {
      delete process.env[name]
    } else {
      process.env[name] = previous
    }
  }
}

describe('parseChangelog()', () => {
  it('maps changelog headings to version tags and appends the compare link', () => {
    const changelog = `## [1.0.1](https://github.com/owner/repo/compare/v1.0.0...v1.0.1) (2026-03-01)

### Features

* Added release automation.

## [1.0.0](https://github.com/owner/repo/releases/tag/v1.0.0) (2026-02-28)

### Bug Fixes

* Fixed old release notes.
`

    expect(parseChangelog(changelog)).toEqual({
      // Compare link surfaced as a "Full Changelog" footer.
      'v1.0.1':
        '### Features\n\n* Added release automation.\n\n**Full Changelog**: https://github.com/owner/repo/compare/v1.0.0...v1.0.1',
      // Non-`/compare/` link → no footer.
      'v1.0.0': '### Bug Fixes\n\n* Fixed old release notes.',
    })
  })

  it('parses oldest Vike entries (single # headings, pre-release versions)', () => {
    const changelogSections = parseChangelog(readFixture('changelog-vike.md'))
    expect(Object.keys(changelogSections)).toEqual([
      'v0.1.0-beta.10',
      'v0.1.0-beta.9',
      'v0.1.0-beta.8',
      'v0.1.0-beta.7',
      'v0.1.0-beta.6',
    ])
    expect(changelogSections['v0.1.0-beta.10']).toContain('### Features')
    expect(changelogSections['v0.1.0-beta.8']).toContain('### BREAKING CHANGES')
    expect(changelogSections['v0.1.0-beta.6']).toContain('Initial public release')
  })

  it('parses oldest Telefunc entries (trailing non-versioned sections)', () => {
    const changelogSections = parseChangelog(readFixture('changelog-telefunc.md'))
    expect(Object.keys(changelogSections)).toEqual(['v0.1.2', 'v0.1.1'])
    expect(changelogSections['v0.1.2']).toContain('improve TelefunctionError type')
    expect(changelogSections['v0.1.1']).toContain('isomorphic imports')
  })

  it('parses oldest vike-vue entries (no-link headings, dash bullets)', () => {
    const changelogSections = parseChangelog(readFixture('changelog-vike-vue.md'))
    expect(Object.keys(changelogSections)).toEqual(['v0.2.3', 'v0.2.2', 'v0.2.1', 'v0.2.0', 'v0.1.1'])
    expect(changelogSections['v0.2.1']).toContain('Fix peer dependency')
    expect(changelogSections['v0.2.0']).toContain('Add `Head` config option')
  })

  it('parses oldest vike-solid entries (single # headings, mixed formats)', () => {
    const changelogSections = parseChangelog(readFixture('changelog-vike-solid.md'))
    expect(Object.keys(changelogSections)).toEqual(['v0.7.2', 'v0.7.1', 'v0.7.0', 'v0.6.2', 'v0.6.1'])
    expect(changelogSections['v0.7.0']).toContain('### BREAKING CHANGES')
    expect(changelogSections['v0.6.1']).toContain('MIGRATION.md')
  })

  it('parses oldest vike-react entries (no-link initial version)', () => {
    const changelogSections = parseChangelog(readFixture('changelog-vike-react.md'))
    expect(Object.keys(changelogSections)).toEqual(['v0.1.6', 'v0.1.5', 'v0.1.4', 'v0.1.3', 'v0.1.2', 'v0.1.1'])
    expect(changelogSections['v0.1.6']).toContain("fix 'vike-react' type")
    expect(changelogSections['v0.1.1']).toContain('fix ESM import paths')
  })
})

describe('getReleasePlan()', () => {
  it('creates missing past releases alongside the current release and updates stale notes', () => {
    const plan = getReleasePlan({
      defaultBranch: 'main',
      packageName: 'vike',
      multiplePackages: false,
      changelogSections: {
        'v1.0.1': 'New release notes',
        'v1.0.0': 'Updated old notes',
        'v0.9.0': 'Existing notes',
        'v0.8.0': 'Missing past notes',
      },
      githubReleases: [
        { id: 1, tag_name: 'v1.0.0', body: 'Outdated old notes' },
        { id: 2, tag_name: 'v0.9.0', body: 'Existing notes' },
      ],
    })

    expect(plan).toEqual({
      releasesToCreate: [
        {
          tag_name: 'v0.8.0',
          target_commitish: 'main',
          name: 'v0.8.0',
          body: 'Missing past notes',
        },
        {
          tag_name: 'v1.0.1',
          target_commitish: 'main',
          name: 'v1.0.1',
          body: 'New release notes',
        },
      ],
      releasesToUpdate: [{ release_id: 1, tag_name: 'v1.0.0', body: 'Updated old notes' }],
      releasesToDelete: [],
    })
  })

  it('updates the current release instead of creating a duplicate', () => {
    const plan = getReleasePlan({
      defaultBranch: 'main',
      packageName: 'vike',
      multiplePackages: false,
      changelogSections: {
        'v1.0.1': 'Fresh release notes',
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
      defaultBranch: 'main',
      packageName: 'vike',
      multiplePackages: false,
      changelogSections: { 'v1.0.0': 'Notes' },
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
      defaultBranch: 'main',
      packageName: 'vike',
      multiplePackages: false,
      changelogSections: { 'v1.0.0': 'Notes' },
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
      defaultBranch: 'main',
      packageName: 'create-vike-core',
      multiplePackages: true,
      changelogSections: { 'v0.0.1': 'Notes' },
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
      defaultBranch: 'main',
      packageName: 'create-vike-core',
      multiplePackages: true,
      changelogSections: {
        'v0.0.2': 'New notes',
        'v0.0.1': 'Old notes',
      },
      // The existing release is matched by its namespaced tag — no duplicate is created for it, and
      // it isn't confused with another package's bare `v0.0.1` release.
      githubReleases: [{ id: 1, tag_name: 'create-vike-core@0.0.1', body: 'Old notes' }],
    })

    expect(plan).toEqual({
      releasesToCreate: [
        {
          tag_name: 'create-vike-core@0.0.2',
          target_commitish: 'main',
          name: 'create-vike-core@0.0.2',
          body: 'New notes',
        },
      ],
      releasesToUpdate: [],
      releasesToDelete: [],
    })
  })
})

describe('getTagName()', () => {
  it('keeps the bare vX.Y.Z tag for a single package', () => {
    expect(getTagName('v0.4.259', 'vike', false)).toBe('v0.4.259')
    expect(getTagName('v0.1.0-beta.6', 'vike', false)).toBe('v0.1.0-beta.6')
  })

  it('qualifies the tag with the package name when there are several packages', () => {
    expect(getTagName('v0.0.391', 'create-vike-core', true)).toBe('create-vike-core@0.0.391')
    expect(getTagName('v0.1.0-beta.6', 'vike', true)).toBe('vike@0.1.0-beta.6')
  })
})

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

  it('ignores CHANGELOG.md files outside packages/ and non-CHANGELOG files', () => {
    expect(
      toPackageDirs(['CHANGELOG.md', 'docs/CHANGELOG.md', 'packages/vike/README.md', 'packages/vike/CHANGELOG.md']),
    ).toEqual(['packages/vike'])
  })

  it('returns an empty array when nothing matches', () => {
    expect(toPackageDirs(['README.md', 'packages/vike/src/index.ts'])).toEqual([])
  })
})

describe('local fallbacks', () => {
  it('returns a valid repository when run locally', () => {
    withEnvUnset('GITHUB_REPOSITORY', () => {
      const repository = getRepository()
      expect(repository.owner).toEqual(expect.any(String))
      expect(repository.repo).toEqual(expect.any(String))
      expect(repository.owner.trim()).not.toBe('')
      expect(repository.repo.trim()).not.toBe('')
    })
  })
})
