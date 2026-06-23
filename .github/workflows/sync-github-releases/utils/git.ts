// Local git plumbing — runs the `git` CLI and shapes its output (e.g. turning its file lists into
// package dirs). Knows nothing of the GitHub Actions environment (github-env.ts) nor the GitHub API
// (github.ts).

export { git }
export { gitLines }
export { getRepoRoot }
export { gitTagExists }
export { findReleaseCommit }
export { getTrackedChangelogFiles }
export { toPackageDirs }

import { execFileSync } from 'node:child_process'
import path from 'node:path'

function git(args: string[]): string {
  return execFileSync('git', args, { encoding: 'utf8' })
}

// git stdout as lines, dropping the trailing blank left by the final newline.
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
  // `*CHANGELOG.md` matches at any depth — git pathspecs aren't anchored to the repo root.
  return gitLines(['ls-files', '--', '*CHANGELOG.md'])
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
  return gitLines(['log', '--reverse', '--format=%H', `-S[${version}](`, '--', '*CHANGELOG.md'])[0] ?? null
}
