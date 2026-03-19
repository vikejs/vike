import { describe, expect, it } from 'vitest'
import { getDefaultBranch, getReleasePlan, getReleaseSections, getRepository } from './sync-releases'

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
