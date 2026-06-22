// Execute main() only when this file is the entry point (via sync-github-releases.yml or package.json script), not when index.spec.ts imports it.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}

import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseChangelog } from './changelog.ts'
import {
  findReleaseCommit,
  getPackageDirsToSync,
  getRepoRoot,
  getTrackedChangelogFiles,
  gitTagExists,
  toPackageDirs,
} from './git.ts'
import { chooseCreateCommitish, getReleasePlan, getTagName, withSourceOfTruth } from './release-plan.ts'
import { fetchGithubReleases, getDefaultBranch, getGithubToken, getRepository, githubRequest } from './github.ts'

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
  // qualified with the package name (see getTagName()). Determined from every tracked CHANGELOG.md,
  // not just the package(s) being synced now.
  const multiplePackages = toPackageDirs(getTrackedChangelogFiles()).length > 1

  for (const packageDir of packageDirs) {
    console.log(`Syncing GitHub releases for package directory: ${packageDir}`)
    await syncPackage({ packageDir, owner, repo, defaultBranch, token, dryRun, multiplePackages })
  }
}

async function syncPackage({
  packageDir,
  owner,
  repo,
  defaultBranch,
  token,
  dryRun,
  multiplePackages,
}: {
  packageDir: string
  owner: string
  repo: string
  defaultBranch: string
  token: string
  dryRun: boolean
  multiplePackages: boolean
}): Promise<void> {
  const require = createRequire(import.meta.url)

  const packageDirPath = path.join(process.cwd(), packageDir)
  const packageJsonPath = path.join(packageDirPath, 'package.json')
  const changelogPath = path.join(packageDirPath, 'CHANGELOG.md')

  const packageJson = require(packageJsonPath) as { name: string }

  const changelog = await readFile(changelogPath, 'utf8')
  const changelogSections = parseChangelog(changelog)

  // These releases are generated, so point each one back to the changelog it mirrors (the source of
  // truth) to discourage editing the GitHub Release directly — a sync would overwrite it.
  const changelogUrl = `https://github.com/${owner}/${repo}/blob/${defaultBranch}/${packageDir}/CHANGELOG.md`
  for (const versionTag of Object.keys(changelogSections)) {
    changelogSections[versionTag] = withSourceOfTruth(changelogSections[versionTag], changelogUrl)
  }

  const githubReleases = await fetchGithubReleases(owner, repo, token)

  const { releasesToCreate, releasesToUpdate, releasesToDelete } = getReleasePlan({
    githubReleases,
    changelogSections,
    packageName: packageJson.name,
    multiplePackages,
  })

  // changelogSections is keyed by `vX.Y.Z`; map each release tag back to its raw changelog version
  // (for the changelog-history lookup) and remember the newest tag (the just-released version).
  const versionTags = Object.keys(changelogSections)
  const versionByTag = new Map(
    versionTags.map((versionTag) => [
      getTagName(versionTag, packageJson.name, multiplePackages),
      versionTag.replace(/^v/, ''),
    ]),
  )
  const newestTag = versionTags.length > 0 ? getTagName(versionTags[0], packageJson.name, multiplePackages) : ''

  for (const releaseToCreate of releasesToCreate) {
    const tagName = releaseToCreate.tag_name
    // A release needs a tag to point at. When the tag is missing, GitHub would otherwise create it at
    // the default branch's HEAD — the wrong commit for a backfilled release. Deduce the real commit
    // from the changelog's history and tag that instead (or refuse, rather than tag the wrong commit).
    const tagExists = gitTagExists(tagName)
    const isNewest = tagName === newestTag
    const deducedCommit = !tagExists && !isNewest ? findReleaseCommit(versionByTag.get(tagName)!) : null
    const targetCommitish = chooseCreateCommitish({ tagName, tagExists, isNewest, deducedCommit, defaultBranch })
    if (!tagExists && !isNewest)
      console.warn(`Tag ${tagName} is missing — creating its release at deduced commit ${deducedCommit}`)

    // https://docs.github.com/en/rest/releases/releases#create-a-release
    await githubRequest(`/repos/${owner}/${repo}/releases`, {
      token,
      method: 'POST',
      body: {
        tag_name: tagName,
        target_commitish: targetCommitish,
        name: releaseToCreate.name,
        body: releaseToCreate.body,
        // Only the newest version may be the repo's "Latest". create-release otherwise defaults
        // make_latest=true, so backfilling an older release while a newer one already exists would
        // wrongly mark the old one Latest.
        make_latest: isNewest ? 'true' : 'false',
      },
      dryRun,
    })
    if (!dryRun) console.log(`Created release ${tagName}`)
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

  for (const releaseToDelete of releasesToDelete) {
    // https://docs.github.com/en/rest/releases/releases#delete-a-release
    await githubRequest(`/repos/${owner}/${repo}/releases/${releaseToDelete.release_id}`, {
      token,
      method: 'DELETE',
      dryRun,
    })
    if (!dryRun) console.log(`Deleted release ${releaseToDelete.tag_name}`)
  }
}
