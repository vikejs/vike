export { parseChangelog }
export { withChangelogFooter }

export type ReleaseNotesByVersion = Record<string, string>

// Parse a CHANGELOG.md into release notes keyed by raw version (e.g. `0.4.257`, `0.1.0-beta.6`),
// newest first. Decorating a version into its git tag is getReleaseTag()'s job, not ours.
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
    releaseNotesByVersion[match[1]] = notes
  })

  return releaseNotesByVersion
}

// These releases are generated, so point each one back to the CHANGELOG.md it mirrors (the source of
// truth) to discourage editing the GitHub Release directly — a sync would overwrite it.
function withChangelogFooter(body: string, changelogUrl: string): string {
  return `${body}\n\n_Source of truth: [\`CHANGELOG.md\`](${changelogUrl})._`
}
