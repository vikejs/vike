// Execute main() only when this file is the entry point (via sync-github-releases.yml or package.json script), not when index.spec.ts imports it.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}

// Exported only for index.spec.ts
export { getReleasePlan }
export { parseChangelog }
export { toPackageDirs }

import assert from 'node:assert'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Release } from './types'
import { fetchGithubReleases, getDefaultBranch, getGithubToken, getRepository, githubRequest } from './github-utils'

async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')

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

function getPackageDirsToSync(): string[] {
  const pushedChangelogFiles = getPushedChangelogFiles()
  if (pushedChangelogFiles) return toPackageDirs(pushedChangelogFiles)

  const packageDirs = toPackageDirs(getTrackedChangelogFiles())

  // Other CI triggers (e.g. a manual workflow_dispatch) reach here: sync every package.
  // GITHUB_ACTIONS is GitHub's documented signal for telling a CI run apart from a local one.
  if (process.env.GITHUB_ACTIONS) return packageDirs

  // Local run: default to the sole package, else require an explicit `<package-dir>`.
  if (packageDirs.length === 1) return packageDirs
  throw new Error('Usage: <package-dir> [--dry-run]')
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
  // changelogSections is newest-first; .reverse() creates the missing releases oldest-first. This
  // matters because create-release defaults to make_latest=true: whichever release is created last
  // becomes the repo's "Latest", so the newest must go last. (The releases list itself is ordered by
  // GitHub on tag semver, not creation order, so backfilled older releases still slot in correctly:
  // https://github.com/vikejs/vike/pull/3157#issuecomment-4406846257)
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
