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
export { getTagName }
export { withSourceOfTruth }
export { chooseCreateCommitish }

import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Release } from './types.ts'
import { fetchGithubReleases, getDefaultBranch, getGithubToken, getRepository, githubRequest } from './github-utils.ts'

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
    defaultBranch,
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
    releaseToCreate.target_commitish = chooseCreateCommitish({
      tagName,
      tagExists,
      isNewest,
      deducedCommit,
      defaultBranch,
    })
    if (!tagExists && !isNewest)
      console.warn(`Tag ${tagName} is missing — creating its release at deduced commit ${deducedCommit}`)

    // https://docs.github.com/en/rest/releases/releases#create-a-release
    await githubRequest(`/repos/${owner}/${repo}/releases`, {
      token,
      method: 'POST',
      body: releaseToCreate,
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

function getPackageDirsToSync(): string[] {
  // On push, sync only the packages whose CHANGELOG.md changed; otherwise (manual workflow_dispatch
  // or a local run with no <package-dir>) sync every package.
  const pushedChangelogFiles = getPushedChangelogFiles()
  if (pushedChangelogFiles) return toPackageDirs(pushedChangelogFiles)
  return toPackageDirs(getTrackedChangelogFiles())
}

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

type ChangelogSections = Record<string, string>
function parseChangelog(changelog: string): ChangelogSections {
  const changelogSections: ChangelogSections = {}
  // Group 1 is the version; group 2 (optional) is the heading's link. release-me links the version to
  // a `…/compare/…` URL — `## [0.4.257](…/compare/…)` — which we surface as the release's "Full
  // Changelog". (The very first release links to a `…/tree/…` URL instead, which we skip.)
  const matches = [...changelog.matchAll(/^##? \[(\d+\.\d+\.\d+[^\]]*)\](?:\(([^)]+)\))?/gm)]

  matches.forEach((match, index) => {
    const start = changelog.indexOf('\n', match.index)
    const end = matches[index + 1]?.index ?? changelog.length
    let notes = changelog.slice(start, end).trim()
    const headingUrl = match[2]
    if (headingUrl?.includes('/compare/')) notes += `\n\n**Full Changelog**: ${headingUrl}`
    changelogSections[`v${match[1]}`] = notes
  })

  return changelogSections
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
type ReleasesToDelete = {
  release_id: number
  tag_name: string
}
// The git tag / GitHub Release tag for a changelog version. A single package keeps the historical
// bare `vX.Y.Z`. Several packages share the repo's tag namespace, so their tags are qualified with
// the package name (e.g. `create-vike-core@0.0.391`) to avoid collisions.
function getTagName(versionTag: string, packageName: string, multiplePackages: boolean): string {
  if (!multiplePackages) return versionTag
  return `${packageName}@${versionTag.replace(/^v/, '')}`
}

// Whether a GitHub Release tag belongs to the package being synced — i.e. is a candidate for
// deletion once its changelog entry is gone. Mirrors getTagName()'s two schemes, so a release of
// another package (or a tag we never created, e.g. `nightly`) is never deleted.
function isOwnedTag(tagName: string, packageName: string, multiplePackages: boolean): boolean {
  if (multiplePackages) return tagName.startsWith(`${packageName}@`)
  return /^v\d+\.\d+\.\d+/.test(tagName)
}

// Footer appended to every release body, linking back to the changelog the release is generated from.
function withSourceOfTruth(body: string, changelogUrl: string): string {
  return `${body}\n\n_Source of truth: [\`CHANGELOG.md\`](${changelogUrl})._`
}

// The commit a to-be-created release should be tagged at (its `target_commitish`).
//  - Tag already exists: GitHub uses it and ignores target_commitish — pass the branch as a no-op.
//  - Tag missing on the newest release: hard fail. The just-released version must already be tagged;
//    tagging it now would point at the default branch's HEAD (the wrong commit).
//  - Tag missing on an older (backfilled) release: tag the commit deduced from the changelog history,
//    or hard fail if it couldn't be deduced — never silently tag the wrong commit.
function chooseCreateCommitish({
  tagName,
  tagExists,
  isNewest,
  deducedCommit,
  defaultBranch,
}: {
  tagName: string
  tagExists: boolean
  isNewest: boolean
  deducedCommit: string | null
  defaultBranch: string
}): string {
  if (tagExists) return defaultBranch
  if (isNewest) {
    throw new Error(
      `Refusing to create release ${tagName}: its git tag is missing. The latest release must already be tagged — creating it now would tag the wrong commit (the default branch's HEAD).`,
    )
  }
  if (!deducedCommit) {
    throw new Error(
      `Refusing to create release ${tagName}: its git tag is missing and its release commit couldn't be deduced from the changelog history.`,
    )
  }
  return deducedCommit
}

function getReleasePlan({
  defaultBranch,
  githubReleases,
  changelogSections,
  packageName,
  multiplePackages,
}: {
  defaultBranch: string
  githubReleases: Release[]
  changelogSections: ChangelogSections
  packageName: string
  multiplePackages: boolean
}) {
  // Reconcile from the changelog (the source of truth), not from the GitHub Releases: iterating the
  // releases for updates would try to rewrite any release whose tag isn't in the changelog (e.g. a
  // release of another package, or a manually-created one) with an `undefined` body. Driving both
  // create and update off the changelog can only ever touch the versions the changelog declares.
  const releasesByTag = new Map(githubReleases.map((release) => [release.tag_name, release]))
  const expectedTags = new Set<string>()
  const releasesToCreate: ReleasesToCreate[] = []
  const releasesToUpdate: ReleasesToUpdate[] = []

  // changelogSections is newest-first; iterate oldest-first so the newest release is created last.
  // This matters because create-release defaults to make_latest=true: whichever release is created
  // last becomes the repo's "Latest". (The releases list itself is ordered by GitHub on tag semver,
  // not creation order, so backfilled older releases still slot in correctly:
  // https://github.com/vikejs/vike/pull/3157#issuecomment-4406846257)
  for (const versionTag of Object.keys(changelogSections).reverse()) {
    const body = changelogSections[versionTag]
    const tagName = getTagName(versionTag, packageName, multiplePackages)
    expectedTags.add(tagName)
    const existingRelease = releasesByTag.get(tagName)
    if (!existingRelease) {
      releasesToCreate.push({ tag_name: tagName, target_commitish: defaultBranch, name: tagName, body })
    } else if (existingRelease.body?.trim() !== body) {
      releasesToUpdate.push({ release_id: existingRelease.id, tag_name: tagName, body })
    }
  }

  // Delete this package's releases whose version is no longer in the changelog (the source of truth).
  const releasesToDelete: ReleasesToDelete[] = githubReleases
    .filter(
      (release) => isOwnedTag(release.tag_name, packageName, multiplePackages) && !expectedTags.has(release.tag_name),
    )
    .map((release) => ({ release_id: release.id, tag_name: release.tag_name }))

  return { releasesToCreate, releasesToUpdate, releasesToDelete }
}
