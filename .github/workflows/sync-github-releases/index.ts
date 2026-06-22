/* === WHAT IS THIS?
Keeps GitHub releases aligned with `CHANGELOG.md`: creates any missing releases, and updates any whose body has drifted from the changelog.
*/

/* === FLOW
0. Determine which package directories to sync (getPackageDirsToSync()):
   - Explicit `<package-dir>` argument (local usage), or
   - The packages whose `CHANGELOG.md` changed in the push (CI usage), or all of them on `workflow_dispatch`.
   This used to live as Bash glue in sync-github-releases.yml — it's now here so all the logic is in JS land.
Then, for each package directory:
1. Read CHANGELOG.md and parse the changelog sections.
2. Fetch existing GitHub releases.
3. getReleasePlan() compares the changelog sections against the GitHub releases, to determine which need to be created and which need their body updated.
   i. Build `releasesToCreate` from changelog sections that don't have a GitHub Release yet.
   ii. Build `releasesToUpdate` from existing GitHub releases whose body no longer matches the changelog section.
   Note: GitHub appears to order releases by semantic version of the tag name rather than by release date, so backfilling older releases still places them in the correct order: https://github.com/vikejs/vike/pull/3157#issuecomment-4406846257 — in other words: the syncing is bullet-proof no matter the current state of GitHub Releases.
4. Apply the plan via the GitHub API (or, in `--dry-run`, log what would be done).
*/

// This file is executed by sync-github-releases.yml
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}

// Only used by ./index.spec.ts
export { getReleasePlan }
export { parseChangelog }
export { toPackageDirs }

import assert from 'node:assert'
import { execFileSync } from 'node:child_process'
import { readFileSync, readdirSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Release } from './types'
import { fetchGithubReleases, getDefaultBranch, getGithubToken, getRepository, githubRequest } from './github-utils'

async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')

  // Local testing:
  // GITHUB_TOKEN=<contents:write token> bun ./.github/workflows/sync-github-releases/index.ts packages/vike
  // Dry-run (still needs a token for read-only GETs):
  // GITHUB_TOKEN=<contents:read token> bun ./.github/workflows/sync-github-releases/index.ts packages/vike --dry-run
  const explicitPackageDirs = args.filter((arg) => !arg.startsWith('--'))
  const packageDirs = explicitPackageDirs.length > 0 ? explicitPackageDirs : getPackageDirsToSync()

  if (packageDirs.length === 0) {
    console.log('No CHANGELOG.md changes detected — nothing to sync.')
    return
  }

  const { owner, repo } = getRepository()
  const defaultBranch = getDefaultBranch()
  const token = getGithubToken()

  for (const packageDir of packageDirs) {
    console.log(`Syncing GitHub releases for package directory: ${packageDir}`)
    await syncPackage({ packageDir, owner, repo, defaultBranch, token, dryRun })
  }
}

async function syncPackage({
  packageDir,
  owner,
  repo,
  defaultBranch,
  token,
  dryRun,
}: {
  packageDir: string
  owner: string
  repo: string
  defaultBranch: string
  token: string
  dryRun: boolean
}): Promise<void> {
  const require = createRequire(import.meta.url)

  const packageDirPath = path.join(process.cwd(), packageDir)
  const packageJsonPath = path.join(packageDirPath, 'package.json')
  const changelogPath = path.join(packageDirPath, 'CHANGELOG.md')

  const packageJson = require(packageJsonPath) as { version: string }

  const versionTag = `v${packageJson.version}`
  const changelog = await readFile(changelogPath, 'utf8')
  const changelogSections = parseChangelog(changelog)
  assertChangelog(versionTag, changelogSections)

  const githubReleases = await fetchGithubReleases(owner, repo, token)

  const { releasesToCreate, releasesToUpdate } = getReleasePlan({
    defaultBranch,
    githubReleases,
    changelogSections,
  })

  for (const releaseToCreate of releasesToCreate) {
    // https://docs.github.com/en/rest/releases/releases#create-a-release
    await githubRequest(`/repos/${owner}/${repo}/releases`, {
      token,
      method: 'POST',
      body: releaseToCreate,
      dryRun,
    })
    if (!dryRun) console.log(`Created release ${releaseToCreate.tag_name}`)
  }

  for (const releaseToUpdate of releasesToUpdate) {
    // https://docs.github.com/en/rest/releases/releases#update-a-release
    await githubRequest(`/repos/${owner}/${repo}/releases/${releaseToUpdate.release_id}`, {
      token,
      method: 'PATCH',
      body: { body: releaseToUpdate.body },
      dryRun,
    })
    if (!dryRun) console.log(`Updated release ${releaseToUpdate.tag_name}`)
  }
}

// Determine which package directories to sync, based on the GitHub Actions event that triggered the workflow.
// (This replaces the Bash glue that used to live in sync-github-releases.yml.)
function getPackageDirsToSync(): string[] {
  // On `push` we only sync the packages whose CHANGELOG.md actually changed; otherwise (e.g. `workflow_dispatch`) we sync them all.
  const changelogFiles = getPushedChangelogFiles() ?? findAllChangelogFiles()
  return toPackageDirs(changelogFiles)
}

// Keep only `packages/**/CHANGELOG.md` files and map them to their (deduplicated) package directory.
function toPackageDirs(files: string[]): string[] {
  const packageDirs = files
    .filter((file) => file.startsWith('packages/') && path.posix.basename(file) === 'CHANGELOG.md')
    .map((file) => path.posix.dirname(file))
  return [...new Set(packageDirs)]
}

// The `CHANGELOG.md` files changed by the push, or `null` if the workflow wasn't triggered by a (diff-able) push.
function getPushedChangelogFiles(): string[] | null {
  if (process.env.GITHUB_EVENT_NAME !== 'push') return null
  const beforeSha = getPushBeforeSha()
  const sha = process.env.GITHUB_SHA
  if (!beforeSha || !sha) return null
  // execFileSync (no shell) avoids any interpolation/injection concerns around the SHAs.
  const stdout = execFileSync('git', ['diff', '--name-only', beforeSha, sha], { encoding: 'utf8' })
  return stdout.split('\n').filter(Boolean)
}

// `github.event.before`: the commit the branch pointed at before the push, read from the event payload GitHub Actions writes to disk.
function getPushBeforeSha(): string | null {
  const eventPath = process.env.GITHUB_EVENT_PATH
  if (!eventPath) return null
  const event = JSON.parse(readFileSync(eventPath, 'utf8')) as { before?: string }
  const before = event.before
  // All-zeros when there's no previous commit to diff against (e.g. the branch's first push).
  if (!before || /^0+$/.test(before)) return null
  return before
}

// Recursively find every `packages/**/CHANGELOG.md` (skipping node_modules and dot-directories).
function findAllChangelogFiles(): string[] {
  const changelogFiles: string[] = []
  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
      const entryPath = path.posix.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(entryPath)
      } else if (entry.name === 'CHANGELOG.md') {
        changelogFiles.push(entryPath)
      }
    }
  }
  walk('packages')
  return changelogFiles.sort()
}

type ChangelogSections = Record<string, string>
function parseChangelog(changelog: string): ChangelogSections {
  const changelogSections: ChangelogSections = {}
  // Matches changelog headings: `## [0.4.257](...)` or `# [0.1.0-beta.6](...)`
  const matches = [...changelog.matchAll(/^##? \[(\d+\.\d+\.\d+[^\]]*)\]/gm)]

  matches.forEach((match, index) => {
    const start = changelog.indexOf('\n', match.index)
    const end = matches[index + 1]?.index ?? changelog.length
    const notes = changelog.slice(start, end).trim()
    changelogSections[`v${match[1]}`] = notes
  })

  return changelogSections
}
function assertChangelog(versionTag: string, changelogSections: ChangelogSections) {
  const latestRelease = Object.keys(changelogSections)[0]
  assert(
    latestRelease === versionTag,
    `The latest changelog entry is ${latestRelease}, but the current version is ${versionTag}`,
  )
  const currentBody = changelogSections[versionTag]
  assert(currentBody, `Missing changelog entry for ${versionTag}`)
}

type ReleasesToCreate = {
  tag_name: string
  target_commitish: string
  name: string
  body: string
}
type ReleasesToUpdate = {
  release_id: number
  tag_name: string
  body: string
}
function getReleasePlan({
  defaultBranch,
  githubReleases,
  changelogSections,
}: {
  defaultBranch: string
  githubReleases: Release[]
  changelogSections: ChangelogSections
}) {
  const releasesToCreate: ReleasesToCreate[] = Object.keys(changelogSections)
    .filter((tagName) => !githubReleases.some((release) => release.tag_name === tagName))
    .reverse()
    .map((tagName) => ({
      tag_name: tagName,
      target_commitish: defaultBranch,
      name: tagName,
      body: changelogSections[tagName],
    }))

  const releasesToUpdate: ReleasesToUpdate[] = githubReleases
    .map((release) => {
      const body = changelogSections[release.tag_name]
      if (body === release.body?.trim()) return null
      return { release_id: release.id, tag_name: release.tag_name, body }
    })
    .filter((release) => release !== null)

  return { releasesToCreate, releasesToUpdate }
}
