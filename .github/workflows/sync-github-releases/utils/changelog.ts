export { parseChangelog }
export { buildReleaseBody }

export type ReleaseNotesByVersion = Record<string, string>

// Parse a CHANGELOG.md into release notes keyed by raw version (e.g. `0.4.257`, `0.1.0-beta.6`),
// newest first. Decorating a version into its git tag is getTagScheme()'s job, not ours.
function parseChangelog(changelog: string): ReleaseNotesByVersion {
  // Match each version heading, ignoring any link release-me appends after the version
  // (`## [0.4.257](…)`) — only the version itself is captured.
  const matches = [...changelog.matchAll(/^##? \[(\d+\.\d+\.\d+[^\]]*)\](?:\([^)]+\))?/gm)]

  return Object.fromEntries(
    matches.map((match, index) => {
      const [, version] = match
      // A version's notes run from the end of its heading line to the start of the next heading.
      const notesStart = changelog.indexOf('\n', match.index)
      const notesEnd = matches[index + 1]?.index ?? changelog.length
      const notes = changelog.slice(notesStart, notesEnd).trim()
      return [version, notes]
    }),
  )
}

// The body we publish for one changelog version, assembled here in a single place from its parsed notes:
//  - topped with the release date, when known. A created GitHub Release otherwise only records when the
//    sync ran (its `published_at`), not when the version shipped — so we surface the real date, taken
//    from the git tag (see getReleaseDate()). A null date (no tag, no deducible commit) drops the line.
//  - tailed with a footer pointing back to the CHANGELOG.md it mirrors, to discourage editing the
//    GitHub Release directly — the next sync would overwrite it.
function buildReleaseBody(
  notes: string,
  { releaseDate, changelogUrl }: { releaseDate: string | null; changelogUrl: string },
): string {
  const dateLine = releaseDate ? `_${formatReleaseDate(releaseDate)}_\n\n` : ''
  const footer = `<sub>Automatically synced from [\`CHANGELOG.md\`](${changelogUrl})</sub>`
  return `${dateLine}${notes}\n\n${footer}`
}

// Render an ISO date (`2026-05-06`) in a human-friendly long form (`May 6, 2026`). Formatted in UTC so
// the day matches getReleaseDate()'s committer date regardless of the runner's timezone.
const releaseDateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
})
function formatReleaseDate(isoDate: string): string {
  return releaseDateFormatter.format(new Date(`${isoDate}T00:00:00Z`))
}
