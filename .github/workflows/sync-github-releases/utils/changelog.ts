export { parseChangelog }
export { getReleaseNotesByVersion }
export { withReleaseDate }

export type ReleaseNotesByVersion = Record<string, string>

// Parse a CHANGELOG.md into release notes keyed by raw version (e.g. `0.4.257`, `0.1.0-beta.6`),
// newest first. Decorating a version into its git tag is getTagScheme()'s job, not ours.
function parseChangelog(changelog: string): ReleaseNotesByVersion {
  // Each heading captures the version and, optionally, its link. release-me links the version to a
  // `…/compare/…` URL — `## [0.4.257](…/compare/…)` — which we surface as the release's "Full
  // Changelog". (The very first release links to a `…/tree/…` URL instead, which we skip.)
  const matches = [...changelog.matchAll(/^##? \[(\d+\.\d+\.\d+[^\]]*)\](?:\(([^)]+)\))?/gm)]

  return Object.fromEntries(
    matches.map((match, index) => {
      const [, version, headingUrl] = match
      // A version's notes run from the end of its heading line to the start of the next heading.
      const notesStart = changelog.indexOf('\n', match.index)
      const notesEnd = matches[index + 1]?.index ?? changelog.length
      let notes = changelog.slice(notesStart, notesEnd).trim()
      if (headingUrl?.includes('/compare/')) notes += `\n\n**Full Changelog**: ${headingUrl}`
      return [version, notes]
    }),
  )
}

// The release notes we publish for each changelog version: the parsed entry plus a footer linking back
// to its CHANGELOG.md.
function getReleaseNotesByVersion(changelog: string, changelogUrl: string): ReleaseNotesByVersion {
  return Object.fromEntries(
    Object.entries(parseChangelog(changelog)).map(([version, notes]) => [
      version,
      withChangelogFooter(notes, changelogUrl),
    ]),
  )
}

// These releases are generated, so point each one back to the CHANGELOG.md it mirrors (the source of
// truth) to discourage editing the GitHub Release directly — a sync would overwrite it.
function withChangelogFooter(body: string, changelogUrl: string): string {
  return `${body}\n\n_Source of truth: [\`CHANGELOG.md\`](${changelogUrl})._`
}

// State, at the top of the notes, the date the version was released. A created GitHub Release records
// the date the sync ran (its `published_at`), not when the version actually shipped — so we surface the
// real date, taken from the git tag (see getReleaseDate()). A null date (no tag, no deducible commit)
// leaves the notes unchanged.
function withReleaseDate(body: string, releaseDate: string | null): string {
  if (!releaseDate) return body
  return `_${releaseDate}_\n\n${body}`
}
