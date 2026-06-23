import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { parseChangelog, withReleaseDate } from './changelog.ts'

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
      '1.0.1':
        '### Features\n\n* Added release automation.\n\n**Full Changelog**: https://github.com/owner/repo/compare/v1.0.0...v1.0.1',
      // Non-`/compare/` link → no footer.
      '1.0.0': '### Bug Fixes\n\n* Fixed old release notes.',
    })
  })

  it('parses oldest Vike entries (single # headings, pre-release versions)', () => {
    const changelogSections = parseChangelog(readFixture('changelog-vike.md'))
    expect(Object.keys(changelogSections)).toEqual([
      '0.1.0-beta.10',
      '0.1.0-beta.9',
      '0.1.0-beta.8',
      '0.1.0-beta.7',
      '0.1.0-beta.6',
    ])
    expect(changelogSections['0.1.0-beta.10']).toContain('### Features')
    expect(changelogSections['0.1.0-beta.8']).toContain('### BREAKING CHANGES')
    expect(changelogSections['0.1.0-beta.6']).toContain('Initial public release')
  })

  it('parses oldest Telefunc entries (trailing non-versioned sections)', () => {
    const changelogSections = parseChangelog(readFixture('changelog-telefunc.md'))
    expect(Object.keys(changelogSections)).toEqual(['0.1.2', '0.1.1'])
    expect(changelogSections['0.1.2']).toContain('improve TelefunctionError type')
    expect(changelogSections['0.1.1']).toContain('isomorphic imports')
  })

  it('parses oldest vike-vue entries (no-link headings, dash bullets)', () => {
    const changelogSections = parseChangelog(readFixture('changelog-vike-vue.md'))
    expect(Object.keys(changelogSections)).toEqual(['0.2.3', '0.2.2', '0.2.1', '0.2.0', '0.1.1'])
    expect(changelogSections['0.2.1']).toContain('Fix peer dependency')
    expect(changelogSections['0.2.0']).toContain('Add `Head` config option')
  })

  it('parses oldest vike-solid entries (single # headings, mixed formats)', () => {
    const changelogSections = parseChangelog(readFixture('changelog-vike-solid.md'))
    expect(Object.keys(changelogSections)).toEqual(['0.7.2', '0.7.1', '0.7.0', '0.6.2', '0.6.1'])
    expect(changelogSections['0.7.0']).toContain('### BREAKING CHANGES')
    expect(changelogSections['0.6.1']).toContain('MIGRATION.md')
  })

  it('parses oldest vike-react entries (no-link initial version)', () => {
    const changelogSections = parseChangelog(readFixture('changelog-vike-react.md'))
    expect(Object.keys(changelogSections)).toEqual(['0.1.6', '0.1.5', '0.1.4', '0.1.3', '0.1.2', '0.1.1'])
    expect(changelogSections['0.1.6']).toContain("fix 'vike-react' type")
    expect(changelogSections['0.1.1']).toContain('fix ESM import paths')
  })
})

describe('withReleaseDate()', () => {
  it('states the release date — human-friendly — at the top of the notes', () => {
    expect(withReleaseDate('### Bug Fixes\n\n* Fixed it.', '2026-05-06')).toBe(
      '_May 6, 2026_\n\n### Bug Fixes\n\n* Fixed it.',
    )
    // Two-digit day at year-end: guards against UTC date drift and confirms no leading zero on the day.
    expect(withReleaseDate('* Note.', '2021-12-31')).toBe('_December 31, 2021_\n\n* Note.')
  })

  it('leaves the notes unchanged when the date is unknown (no tag, no deducible commit)', () => {
    expect(withReleaseDate('### Bug Fixes\n\n* Fixed it.', null)).toBe('### Bug Fixes\n\n* Fixed it.')
  })
})
