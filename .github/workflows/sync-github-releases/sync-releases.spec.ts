import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { getDefaultBranch, getReleasePlan, getReleaseSections, getRepository } from './sync-releases'

function readFixture(name: string): string {
  return readFileSync(path.join(__dirname, 'fixtures', name), 'utf8')
}

describe('getReleaseSections()', () => {
  it('maps changelog headings to version tags', () => {
    const changelog = `## [1.0.1](https://example.org) (2026-03-01)

### Features

* Added release automation.

## [1.0.0](https://example.org) (2026-02-28)

### Bug Fixes

* Fixed old release notes.
`

    expect(getReleaseSections(changelog)).toEqual({
      'v1.0.1': '### Features\n\n* Added release automation.',
      'v1.0.0': '### Bug Fixes\n\n* Fixed old release notes.',
    })
  })

  it('parses oldest Vike entries (single # headings, pre-release versions)', () => {
    const sections = getReleaseSections(readFixture('changelog-vike.md'))
    expect(Object.keys(sections)).toEqual([
      'v0.1.0-beta.10',
      'v0.1.0-beta.9',
      'v0.1.0-beta.8',
      'v0.1.0-beta.7',
      'v0.1.0-beta.6',
    ])
    expect(sections['v0.1.0-beta.10']).toContain('### Features')
    expect(sections['v0.1.0-beta.8']).toContain('### BREAKING CHANGES')
    expect(sections['v0.1.0-beta.6']).toContain('Initial public release')
  })

  it('parses oldest Telefunc entries (trailing non-versioned sections)', () => {
    const sections = getReleaseSections(readFixture('changelog-telefunc.md'))
    expect(Object.keys(sections)).toEqual(['v0.1.2', 'v0.1.1'])
    expect(sections['v0.1.2']).toContain('improve TelefunctionError type')
    expect(sections['v0.1.1']).toContain('isomorphic imports')
  })

  it('parses oldest vike-vue entries (no-link headings, dash bullets)', () => {
    const sections = getReleaseSections(readFixture('changelog-vike-vue.md'))
    expect(Object.keys(sections)).toEqual(['v0.2.3', 'v0.2.2', 'v0.2.1', 'v0.2.0', 'v0.1.1'])
    expect(sections['v0.2.1']).toContain('Fix peer dependency')
    expect(sections['v0.2.0']).toContain('Add `Head` config option')
  })

  it('parses oldest vike-solid entries (single # headings, mixed formats)', () => {
    const sections = getReleaseSections(readFixture('changelog-vike-solid.md'))
    expect(Object.keys(sections)).toEqual(['v0.7.2', 'v0.7.1', 'v0.7.0', 'v0.6.2', 'v0.6.1'])
    expect(sections['v0.7.0']).toContain('### BREAKING CHANGES')
    expect(sections['v0.6.1']).toContain('MIGRATION.md')
  })

  it('parses oldest vike-react entries (no-link initial version)', () => {
    const sections = getReleaseSections(readFixture('changelog-vike-react.md'))
    expect(Object.keys(sections)).toEqual(['v0.1.6', 'v0.1.5', 'v0.1.4', 'v0.1.3', 'v0.1.2', 'v0.1.1'])
    expect(sections['v0.1.6']).toContain("fix 'vike-react' type")
    expect(sections['v0.1.1']).toContain('fix ESM import paths')
  })
})

describe('getReleasePlan()', () => {
  it('creates the current release when missing and updates stale notes', () => {
    const plan = getReleasePlan({
      defaultBranch: 'main',
      versionTag: 'v1.0.1',
      sections: {
        'v1.0.1': 'New release notes',
        'v1.0.0': 'Updated old notes',
        'v0.9.0': 'Existing notes',
      },
      releases: [
        { id: 1, tag_name: 'v1.0.0', body: 'Outdated old notes' },
        { id: 2, tag_name: 'v0.9.0', body: 'Existing notes' },
      ],
    })

    expect(plan).toEqual({
      releaseToCreate: {
        tag_name: 'v1.0.1',
        target_commitish: 'main',
        name: 'v1.0.1',
        body: 'New release notes',
      },
      releasesToUpdate: [{ release_id: 1, tag_name: 'v1.0.0', body: 'Updated old notes' }],
    })
  })

  it('updates the current release instead of creating a duplicate', () => {
    const plan = getReleasePlan({
      defaultBranch: 'main',
      versionTag: 'v1.0.1',
      sections: {
        'v1.0.1': 'Fresh release notes',
      },
      releases: [{ id: 3, tag_name: 'v1.0.1', body: 'Stale release notes' }],
    })

    expect(plan).toEqual({
      releaseToCreate: null,
      releasesToUpdate: [{ release_id: 3, tag_name: 'v1.0.1', body: 'Fresh release notes' }],
    })
  })

  it('throws when the current version is missing from the changelog', () => {
    expect(() =>
      getReleasePlan({
        defaultBranch: 'main',
        versionTag: 'v1.0.1',
        sections: {},
        releases: [],
      }),
    ).toThrow('Missing changelog entry for v1.0.1')
  })
})

describe('local fallbacks', () => {
  it('falls back to the production repository when run locally', () => {
    const previous = process.env.GITHUB_REPOSITORY
    try {
      delete process.env.GITHUB_REPOSITORY
      expect(getRepository()).toEqual({ owner: 'vikejs', repo: 'vike' })
    } finally {
      if (previous === undefined) {
        delete process.env.GITHUB_REPOSITORY
      } else {
        process.env.GITHUB_REPOSITORY = previous
      }
    }
  })

  it('falls back to the main branch when run locally', () => {
    const previous = process.env.GITHUB_DEFAULT_BRANCH
    try {
      delete process.env.GITHUB_DEFAULT_BRANCH
      expect(getDefaultBranch()).toBe('main')
    } finally {
      if (previous === undefined) {
        delete process.env.GITHUB_DEFAULT_BRANCH
      } else {
        process.env.GITHUB_DEFAULT_BRANCH = previous
      }
    }
  })
})
