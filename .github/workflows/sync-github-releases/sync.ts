// Synchronize CHANGELOG.md -> GitHub Releases.
// Run via the package.json scripts `sync` or `sync:check` — see README.md

main()

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { parseChangelog, withChangelogFooter } from './utils/changelog.ts'
import {
  findReleaseCommit,
  getPushedFiles,
  getRepoRoot,
  getTrackedChangelogFiles,
  gitTagExists,
  toPackageDirs,
} from './utils/git.ts'
import { getReleasePlan, resolveTargetCommitish, type ReleaseToCreate } from './release-plan.ts'
import {
  createReleasesClient,
  getDefaultBranch,
  getGithubToken,
  getRepository,
  type ReleasesClient,
} from './utils/github.ts'

async function main(): Promise<void> {
  // The package.json scripts run from this folder; switch to the repo root so the git commands and
  // package-dir paths below resolve against it.
  process.chdir(getRepoRoot())

  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')

  // Every package tracked in the repo — one per CHANGELOG.md. Used both as the default set to sync and
  // to pick the tag scheme: when several packages share the repo they also share its tag namespace, so
  // their release tags are qualified with the package name (see getReleaseTag()).
  const allPackageDirs = toPackageDirs(getTrackedChangelogFiles())
  const packageDirs = getPackageDirsToSync(args, allPackageDirs)
  if (packageDirs.length === 0) {
    console.log('No CHANGELOG.md changes detected — nothing to sync.')
    return
  }
  const hasMultiplePackages = allPackageDirs.length > 1

  const { owner, repo } = getRepository()
  const defaultBranch = getDefaultBranch()
  const client = createReleasesClient({ owner, repo, token: getGithubToken(), dryRun })

  for (const packageDir of packageDirs) {
    console.log(`Syncing GitHub releases for package directory: ${packageDir}`)
    await syncPackage({ packageDir, client, owner, repo, defaultBranch, hasMultiplePackages, dryRun })
  }
}

async function syncPackage({
  packageDir,
  client,
  owner,
  repo,
  defaultBranch,
  hasMultiplePackages,
  dryRun,
}: {
  packageDir: string
  client: ReleasesClient
  owner: string
  repo: string
  defaultBranch: string
  hasMultiplePackages: boolean
  dryRun: boolean
}): Promise<void> {
  const packageDirPath = path.join(process.cwd(), packageDir)
  const packageJson = JSON.parse(await readFile(path.join(packageDirPath, 'package.json'), 'utf8')) as { name: string }
  const changelog = await readFile(path.join(packageDirPath, 'CHANGELOG.md'), 'utf8')

  // path.posix.join keeps the URL clean when packageDir is '.' (a repo-root CHANGELOG.md): no `/./`.
  const changelogRepoPath = path.posix.join(packageDir, 'CHANGELOG.md')
  const changelogUrl = `https://github.com/${owner}/${repo}/blob/${defaultBranch}/${changelogRepoPath}`
  const releaseNotesByVersion = Object.fromEntries(
    Object.entries(parseChangelog(changelog)).map(([version, notes]) => [
      version,
      withChangelogFooter(notes, changelogUrl),
    ]),
  )

  const githubReleases = await client.list()
  const plan = getReleasePlan({
    githubReleases,
    releaseNotesByVersion,
    packageName: packageJson.name,
    hasMultiplePackages,
  })
  await applyReleasePlan(plan, client, defaultBranch, dryRun)
}

async function applyReleasePlan(
  plan: ReturnType<typeof getReleasePlan>,
  client: ReleasesClient,
  defaultBranch: string,
  dryRun: boolean,
): Promise<void> {
  for (const release of plan.releasesToCreate) {
    await client.create({
      tag_name: release.tag_name,
      name: release.tag_name,
      body: release.body,
      target_commitish: resolveCreateTarget(release, defaultBranch),
      // Only the newest version may be the repo's "Latest". create-release otherwise defaults
      // make_latest=true, so backfilling an older release while a newer one already exists would
      // wrongly mark the old one Latest.
      make_latest: release.isLatest ? 'true' : 'false',
    })
    if (!dryRun) console.log(`Created release ${release.tag_name}`)
  }

  for (const release of plan.releasesToUpdate) {
    await client.update(release.release_id, release.body)
    if (!dryRun) console.log(`Updated release ${release.tag_name}`)
  }

  for (const release of plan.releasesToDelete) {
    await client.delete(release.release_id)
    if (!dryRun) console.log(`Deleted release ${release.tag_name}`)
  }
}

// The commit a to-be-created release is tagged at. A release needs a tag to point at; when it's
// missing, GitHub would create it at the default branch's HEAD — the wrong commit for a backfilled
// (older) release. So deduce the real commit from the changelog history and tag that instead.
// resolveTargetCommitish() turns these git facts into the commitish, or refuses rather than tag the
// wrong commit.
function resolveCreateTarget(release: ReleaseToCreate, defaultBranch: string): string {
  const { tag_name: releaseTag, version, isLatest } = release
  const tagExists = gitTagExists(releaseTag)
  const deducedCommit = !tagExists && !isLatest ? findReleaseCommit(version) : null
  if (deducedCommit)
    console.warn(`Tag ${releaseTag} is missing — creating its release at deduced commit ${deducedCommit}`)
  return resolveTargetCommitish({ releaseTag, tagExists, isLatest, deducedCommit, defaultBranch })
}

// Which package directories to sync:
//  - an explicit <package-dir> argument (anything that isn't a --flag), or
//  - on push (CI): the packages whose CHANGELOG.md changed, or
//  - otherwise (manual workflow_dispatch, or a local run with no <package-dir>): every package.
function getPackageDirsToSync(args: string[], allPackageDirs: string[]): string[] {
  const explicitPackageDirs = args.filter((arg) => !arg.startsWith('--'))
  if (explicitPackageDirs.length > 0) return explicitPackageDirs
  const pushedFiles = getPushedFiles()
  if (pushedFiles) return toPackageDirs(pushedFiles)
  return allPackageDirs
}
