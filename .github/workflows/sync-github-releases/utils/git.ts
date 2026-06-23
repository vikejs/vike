// Local git plumbing — runs the `git` CLI and shapes its output (e.g. turning its file lists into
// package dirs). Knows nothing of the GitHub Actions environment (github-env.ts) nor the GitHub API
// (github.ts).

export { git }
export { gitLines }
export { getRepoRoot }
export { gitTagExists }
export { findReleaseCommit }
export { getReleaseDate }
export { getTrackedChangelogFiles }
export { toPackageDirs }

import { execFileSync } from 'node:child_process'
import path from 'node:path'

// Matches any CHANGELOG.md at any depth — git pathspecs aren't anchored to the repo root.
const CHANGELOG_PATHSPEC = '*CHANGELOG.md'

function git(args: string[]): string {
  return execFileSync('git', args, { encoding: 'utf8' })
}

function gitLines(args: string[]): string[] {
  return git(args).split('\n').filter(Boolean)
}

function getRepoRoot(): string {
  return git(['rev-parse', '--show-toplevel']).trim()
}

function toPackageDirs(files: string[]): string[] {
  // A package is any directory containing a CHANGELOG.md, wherever it lives — `packages/vike`, a repo
  // whose single CHANGELOG.md sits at the repo root (`.`), or any other layout. git reports
  // forward-slash paths on every OS, so parse them with path.posix.
  const packageDirs = files
    .filter((file) => path.posix.basename(file) === 'CHANGELOG.md')
    .map((file) => path.posix.dirname(file))
  return [...new Set(packageDirs)]
}

function getTrackedChangelogFiles(): string[] {
  return gitLines(['ls-files', '--', CHANGELOG_PATHSPEC])
}

function gitTagExists(releaseTag: string): boolean {
  // `rev-parse --verify` exits non-zero (so git() throws) when the tag is missing.
  try {
    git(['rev-parse', '-q', '--verify', `refs/tags/${releaseTag}`])
    return true
  } catch {
    return false
  }
}

// The commit that introduced this version's changelog entry — i.e. the release commit, which is where
// its tag belongs. Pickaxe (`-S`, a literal-string search) the changelog history for the heading's
// link opener `[<version>](`; the oldest commit that changed its count is the one that added it.
function findReleaseCommit(version: string): string | null {
  return gitLines(['log', '--reverse', '--format=%H', `-S[${version}](`, '--', CHANGELOG_PATHSPEC])[0] ?? null
}

// The date a version was released, as `YYYY-MM-DD`: the committer date of the commit its release points
// to — the git tag's commit if the tag exists, otherwise the commit deduced from the changelog history
// (the same commit apply-release-plan.ts would tag). null when neither resolves. The commit date is
// what GitHub derives the release's own date (`created_at`) from, and what CHANGELOG.md headings show.
function getReleaseDate(releaseTag: string, version: string): string | null {
  const commitish = gitTagExists(releaseTag) ? `refs/tags/${releaseTag}` : findReleaseCommit(version)
  if (!commitish) return null
  // %cs is the committer date in short form (YYYY-MM-DD).
  return git(['log', '-1', '--format=%cs', commitish]).trim()
}
