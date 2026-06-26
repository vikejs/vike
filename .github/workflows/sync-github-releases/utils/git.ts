// Local git plumbing — runs the `git` CLI and shapes its output (e.g. turning its file lists into
// package dirs). Knows nothing of the GitHub Actions environment (github-env.ts) nor the GitHub API
// (github.ts).

export { getRepoRoot }
export { getRepositoryFromGitRemote }
export { gitTagExists }
export { findReleaseCommit }
export { getReleaseDate }
export { getTrackedChangelogFiles }
export { getChangedFiles }
export { toPackageDirs }

import assert from 'node:assert'
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

// The repository's `owner/repo` slug, parsed from the origin remote's GitHub URL. A fallback for local
// runs where GITHUB_REPOSITORY isn't set (see github-env.ts). Handles both
// https://github.com/owner/repo.git and git@github.com:owner/repo.git.
function getRepositoryFromGitRemote(): string {
  const url = git(['remote', 'get-url', 'origin']).trim()
  const match = url.match(/github\.com[:/](.+?)(?:\.git)?$/)
  assert(match, `Cannot parse GitHub repository from git remote: ${url}`)
  return match[1]
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

// The files that changed between two commits, one path per line — used to scope a push to the packages
// it touched (see getPushedFiles()). Deletions are excluded (`--diff-filter=d`): a push that removes a
// package's CHANGELOG.md still lists it as changed, but that file is gone — syncing its (now missing)
// directory would only fail to read it.
function getChangedFiles(beforeSha: string, headSha: string): string[] {
  // The SHAs are passed as argv (git() uses no shell), so they can't cause injection.
  return gitLines(['diff', '--name-only', '--diff-filter=d', beforeSha, headSha])
}

// A release tag's fully-qualified ref. The `refs/tags/` prefix pins it to a tag, so git can't resolve
// a like-named branch (or any other ref) instead.
function tagRef(releaseTag: string): string {
  return `refs/tags/${releaseTag}`
}

function gitTagExists(releaseTag: string): boolean {
  // `rev-parse --verify` exits non-zero (so git() throws) when the tag is missing.
  try {
    git(['rev-parse', '-q', '--verify', tagRef(releaseTag)])
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
  const commitish = gitTagExists(releaseTag) ? tagRef(releaseTag) : findReleaseCommit(version)
  if (!commitish) return null
  // %cs is the committer date in short form (YYYY-MM-DD).
  return git(['log', '-1', '--format=%cs', commitish]).trim()
}
