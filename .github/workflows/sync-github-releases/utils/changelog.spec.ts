import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { parseChangelog } from './changelog.ts'

function readFixture(name: string): string {
  return readFileSync(path.join(__dirname, 'changelog-spec-fixtures', name), 'utf8')
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

  it('parses entries with single # headings and pre-release versions', () => {
    const changelogSections = parseChangelog(readFixture('changelog-single-hash-headings.md'))
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

  it('parses entries with trailing non-versioned sections', () => {
    const changelogSections = parseChangelog(readFixture('changelog-trailing-sections.md'))
    expect(Object.keys(changelogSections)).toEqual(['v0.1.2', 'v0.1.1'])
    expect(changelogSections['v0.1.2']).toContain('improve error type')
    expect(changelogSections['v0.1.1']).toContain('isomorphic imports')
  })

  it('parses entries with no-link headings and dash bullets', () => {
    const changelogSections = parseChangelog(readFixture('changelog-dash-bullets.md'))
    expect(Object.keys(changelogSections)).toEqual(['v0.2.3', 'v0.2.2', 'v0.2.1', 'v0.2.0', 'v0.1.1'])
    expect(changelogSections['v0.2.1']).toContain('Fix peer dependency')
    expect(changelogSections['v0.2.0']).toContain('Add `Head` config option')
  })

  it('parses entries with a mix of # and ## headings', () => {
    const changelogSections = parseChangelog(readFixture('changelog-mixed-hash-headings.md'))
    expect(Object.keys(changelogSections)).toEqual(['v0.7.2', 'v0.7.1', 'v0.7.0', 'v0.6.2', 'v0.6.1'])
    expect(changelogSections['v0.7.0']).toContain('### BREAKING CHANGES')
    expect(changelogSections['v0.6.1']).toContain('MIGRATION.md')
  })

  it('parses entries with a no-link initial version', () => {
    const changelogSections = parseChangelog(readFixture('changelog-no-link-initial.md'))
    expect(Object.keys(changelogSections)).toEqual(['v0.1.6', 'v0.1.5', 'v0.1.4', 'v0.1.3', 'v0.1.2', 'v0.1.1'])
    expect(changelogSections['v0.1.6']).toContain('fix type export')
    expect(changelogSections['v0.1.1']).toContain('fix ESM import paths')
  })
})
