export { getRepoRoot }
export { gitTagExists }
export { findReleaseCommit }
export { getTrackedChangelogFiles }
export { getPushedChangelogFiles }
export { toPackageDirs }

import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'

function getRepoRoot(): string {
  return execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim()
}

function toPackageDirs(files: string[]): string[] {
  // git reports forward-slash paths on every OS, so parse them with path.posix.
  const packageDirs = files
    .filter((file) => file.startsWith('packages/') && path.posix.basename(file) === 'CHANGELOG.md')
    .map((file) => path.posix.dirname(file))
  return [...new Set(packageDirs)]
}

function getPushedChangelogFiles(): string[] | null {
  if (process.env.GITHUB_EVENT_NAME !== 'push') return null
  const beforeSha = getPushBeforeSha()
  const sha = process.env.GITHUB_SHA
  if (!beforeSha || !sha) return null
  // execFileSync runs git without a shell, so the interpolated SHAs can't cause injection.
  const stdout = execFileSync('git', ['diff', '--name-only', beforeSha, sha], { encoding: 'utf8' })
  return stdout.split('\n').filter(Boolean)
}

// `before` is the commit the branch pointed at prior to the push. GitHub Actions writes the
// triggering event's payload to the file at GITHUB_EVENT_PATH.
function getPushBeforeSha(): string | null {
  const eventPath = process.env.GITHUB_EVENT_PATH
  if (!eventPath) return null
  const event = JSON.parse(readFileSync(eventPath, 'utf8')) as { before?: string }
  const before = event.before
  // GitHub uses an all-zero SHA when there's no prior commit (e.g. a branch's first push).
  if (!before || /^0+$/.test(before)) return null
  return before
}

function getTrackedChangelogFiles(): string[] {
  // `*CHANGELOG.md` matches at any depth — git pathspecs aren't anchored to the repo root.
  const stdout = execFileSync('git', ['ls-files', '--', '*CHANGELOG.md'], { encoding: 'utf8' })
  return stdout.split('\n').filter(Boolean)
}

function gitTagExists(tagName: string): boolean {
  try {
    execFileSync('git', ['rev-parse', '-q', '--verify', `refs/tags/${tagName}`], { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

// The commit that introduced this version's changelog entry — i.e. the release commit, which is where
// its tag belongs. Pickaxe (`-S`, a literal-string search) the changelog history for the heading's
// link opener `[<version>](`; the oldest commit that changed its count is the one that added it.
function findReleaseCommit(version: string): string | null {
  const stdout = execFileSync('git', ['log', '--reverse', '--format=%H', `-S[${version}](`, '--', '*CHANGELOG.md'], {
    encoding: 'utf8',
  })
  return stdout.split('\n').filter(Boolean)[0] ?? null
}
