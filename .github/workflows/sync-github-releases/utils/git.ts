export { getRepoRoot }
export { gitTagExists }
export { findReleaseCommit }
export { getTrackedChangelogFiles }
export { getPushedFiles }
export { toPackageDirs }

import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
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

function getPushedFiles(): string[] | null {
  if (process.env.GITHUB_EVENT_NAME !== 'push') return null
  const beforeSha = getCommitBeforePush()
  const headSha = process.env.GITHUB_SHA
  if (!beforeSha || !headSha) return null
  // The SHAs are passed as argv (git() uses no shell), so they can't cause injection.
  return gitLines(['diff', '--name-only', beforeSha, headSha])
}

// The commit the branch pointed at before the push (`github.event.before`). GitHub Actions writes the
// triggering event's payload to the file at GITHUB_EVENT_PATH.
function getCommitBeforePush(): string | null {
  const eventPath = process.env.GITHUB_EVENT_PATH
  if (!eventPath) return null
  const event = JSON.parse(readFileSync(eventPath, 'utf8')) as { before?: string }
  const beforeSha = event.before
  // GitHub uses an all-zero SHA when there's no prior commit (e.g. a branch's first push).
  if (!beforeSha || /^0+$/.test(beforeSha)) return null
  return beforeSha
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
