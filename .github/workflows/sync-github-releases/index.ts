import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { parseChangelog } from './utils/changelog.ts'
import {
  findReleaseCommit,
  getPushedFiles,
  getRepoRoot,
  getTrackedChangelogFiles,
  gitTagExists,
  toPackageDirs,
} from './utils/git.ts'
import { resolveTargetCommitish, getReleasePlan, getReleaseTag, withChangelogFooter } from './release-plan.ts'
import {
  createRelease,
  deleteRelease,
  fetchGithubReleases,
  getDefaultBranch,
  getGithubToken,
  getRepository,
  updateReleaseBody,
} from './utils/github.ts'
import { runAsMain } from './utils/run-as-main.ts'

runAsMain(import.meta.url, main)

async function main(): Promise<void> {
  // The package.json scripts run from this folder; switch to the repo root so the git commands and
  // package-dir paths below resolve against it.
  process.chdir(getRepoRoot())

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

  // When several packages publish to the same repo they share its tag namespace, so releases are
  // qualified with the package name (see getReleaseTag()). Determined from every tracked CHANGELOG.md,
  // not just the package(s) being synced now.
  const hasMultiplePackages = toPackageDirs(getTrackedChangelogFiles()).length > 1

  for (const packageDir of packageDirs) {
    console.log(`Syncing GitHub releases for package directory: ${packageDir}`)
    await syncPackage({ packageDir, owner, repo, defaultBranch, token, dryRun, hasMultiplePackages })
  }
}

async function syncPackage({
  packageDir,
  owner,
  repo,
  defaultBranch,
  token,
  dryRun,
  hasMultiplePackages,
}: {
  packageDir: string
  owner: string
  repo: string
  defaultBranch: string
  token: string
  dryRun: boolean
  hasMultiplePackages: boolean
}): Promise<void> {
  const require = createRequire(import.meta.url)

  const packageDirPath = path.join(process.cwd(), packageDir)
  const packageJsonPath = path.join(packageDirPath, 'package.json')
  const changelogPath = path.join(packageDirPath, 'CHANGELOG.md')

  const packageJson = require(packageJsonPath) as { name: string }

  const changelog = await readFile(changelogPath, 'utf8')
  const releaseNotesByVersion = parseChangelog(changelog)

  // These releases are generated, so point each one back to the changelog it mirrors (the source of
  // truth) to discourage editing the GitHub Release directly — a sync would overwrite it.
  const changelogUrl = `https://github.com/${owner}/${repo}/blob/${defaultBranch}/${packageDir}/CHANGELOG.md`
  for (const versionTag of Object.keys(releaseNotesByVersion)) {
    releaseNotesByVersion[versionTag] = withChangelogFooter(releaseNotesByVersion[versionTag], changelogUrl)
  }

  const githubReleases = await fetchGithubReleases(owner, repo, token)

  const { releasesToCreate, releasesToUpdate, releasesToDelete } = getReleasePlan({
    githubReleases,
    releaseNotesByVersion,
    packageName: packageJson.name,
    hasMultiplePackages,
  })

  // releaseNotesByVersion is keyed by `vX.Y.Z`; map each release tag back to its raw changelog version
  // (for the changelog-history lookup) and remember the newest tag (the just-released version).
  const versionTags = Object.keys(releaseNotesByVersion)
  const versionByTag = new Map(
    versionTags.map((versionTag) => [
      getReleaseTag(versionTag, packageJson.name, hasMultiplePackages),
      versionTag.replace(/^v/, ''),
    ]),
  )
  const newestReleaseTag =
    versionTags.length > 0 ? getReleaseTag(versionTags[0], packageJson.name, hasMultiplePackages) : ''

  for (const releaseToCreate of releasesToCreate) {
    const releaseTag = releaseToCreate.tag_name
    // A release needs a tag to point at. When the tag is missing, GitHub would otherwise create it at
    // the default branch's HEAD — the wrong commit for a backfilled release. Deduce the real commit
    // from the changelog's history and tag that instead (or refuse, rather than tag the wrong commit).
    const tagExists = gitTagExists(releaseTag)
    const isNewest = releaseTag === newestReleaseTag
    const deducedCommit = !tagExists && !isNewest ? findReleaseCommit(versionByTag.get(releaseTag)!) : null
    const targetCommitish = resolveTargetCommitish({ releaseTag, tagExists, isNewest, deducedCommit, defaultBranch })
    if (!tagExists && !isNewest)
      console.warn(`Tag ${releaseTag} is missing — creating its release at deduced commit ${deducedCommit}`)

    await createRelease(
      owner,
      repo,
      token,
      {
        tag_name: releaseTag,
        target_commitish: targetCommitish,
        name: releaseToCreate.name,
        body: releaseToCreate.body,
        // Only the newest version may be the repo's "Latest". create-release otherwise defaults
        // make_latest=true, so backfilling an older release while a newer one already exists would
        // wrongly mark the old one Latest.
        make_latest: isNewest ? 'true' : 'false',
      },
      dryRun,
    )
    if (!dryRun) console.log(`Created release ${releaseTag}`)
  }

  for (const releaseToUpdate of releasesToUpdate) {
    await updateReleaseBody(owner, repo, token, releaseToUpdate.release_id, releaseToUpdate.body, dryRun)
    if (!dryRun) console.log(`Updated release ${releaseToUpdate.tag_name}`)
  }

  for (const releaseToDelete of releasesToDelete) {
    await deleteRelease(owner, repo, token, releaseToDelete.release_id, dryRun)
    if (!dryRun) console.log(`Deleted release ${releaseToDelete.tag_name}`)
  }
}

function getPackageDirsToSync(): string[] {
  // On push, sync only the packages whose CHANGELOG.md changed; otherwise (manual workflow_dispatch
  // or a local run with no <package-dir>) sync every package.
  const pushedFiles = getPushedFiles()
  if (pushedFiles) return toPackageDirs(pushedFiles)
  return toPackageDirs(getTrackedChangelogFiles())
}
