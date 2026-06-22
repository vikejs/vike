export { parseChangelog }

// One entry per changelog version: `vX.Y.Z` → release notes (Markdown).
export type ReleaseNotesByVersion = Record<string, string>

// Parse a release-me CHANGELOG.md into per-version release notes.
function parseChangelog(changelog: string): ReleaseNotesByVersion {
  const releaseNotesByVersion: ReleaseNotesByVersion = {}
  // Group 1 is the version; group 2 (optional) is the heading's link. release-me links the version to
  // a `…/compare/…` URL — `## [0.4.257](…/compare/…)` — which we surface as the release's "Full
  // Changelog". (The very first release links to a `…/tree/…` URL instead, which we skip.)
  const matches = [...changelog.matchAll(/^##? \[(\d+\.\d+\.\d+[^\]]*)\](?:\(([^)]+)\))?/gm)]

  matches.forEach((match, index) => {
    const start = changelog.indexOf('\n', match.index)
    const end = matches[index + 1]?.index ?? changelog.length
    let notes = changelog.slice(start, end).trim()
    const headingUrl = match[2]
    if (headingUrl?.includes('/compare/')) notes += `\n\n**Full Changelog**: ${headingUrl}`
    releaseNotesByVersion[`v${match[1]}`] = notes
  })

  return releaseNotesByVersion
}
