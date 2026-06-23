// Synchronize CHANGELOG.md -> GitHub Releases.
// Run via the package.json scripts `sync` or `sync:check` — see README.md

main()

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { applyReleasePlan } from './sync/apply-release-plan.ts'
import { getReleasePlan } from './sync/release-plan.ts'
import { getReleaseNotesByVersion } from './utils/changelog.ts'
import { getPushedFiles, getRepoRoot, getTrackedChangelogFiles, toPackageDirs } from './utils/git.ts'
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
  // their release tags are qualified with the package name (see getTagScheme()).
  const allPackageDirs = toPackageDirs(getTrackedChangelogFiles())
  const packageDirs = getPackageDirsToSync(args, allPackageDirs)
  if (packageDirs.length === 0) {
    console.log('No CHANGELOG.md changes detected — nothing to sync.')
    return
  }
  const hasMultiplePackages = allPackageDirs.length > 1

  const { owner, repo } = getRepository()
  const defaultBranch = getDefaultBranch()
  const context: SyncContext = {
    client: createReleasesClient({ owner, repo, token: getGithubToken() }),
    defaultBranch,
    hasMultiplePackages,
    dryRun,
    // The base of the GitHub web (blob) URL each release's CHANGELOG.md footer links back to —
    // github.com is the web host, distinct from the API the client talks to.
    changelogUrlBase: `https://github.com/${owner}/${repo}/blob/${defaultBranch}`,
  }

  for (const packageDir of packageDirs) {
    console.log(`Syncing GitHub releases for package directory: ${packageDir}`)
    await syncPackage(packageDir, context)
  }
}

// The loop-invariant inputs of a sync run, built once and shared across packages. owner/repo aren't
// here: the client already binds them, and the changelog URL base bakes them in.
type SyncContext = {
  client: ReleasesClient
  defaultBranch: string
  hasMultiplePackages: boolean
  dryRun: boolean
  changelogUrlBase: string
}

async function syncPackage(packageDir: string, ctx: SyncContext): Promise<void> {
  const packageDirPath = path.join(process.cwd(), packageDir)
  const packageJson = JSON.parse(await readFile(path.join(packageDirPath, 'package.json'), 'utf8')) as { name: string }
  const changelog = await readFile(path.join(packageDirPath, 'CHANGELOG.md'), 'utf8')

  // path.posix.join keeps the URL clean when packageDir is '.' (a repo-root CHANGELOG.md): no `/./`.
  const changelogUrl = `${ctx.changelogUrlBase}/${path.posix.join(packageDir, 'CHANGELOG.md')}`
  const releaseNotesByVersion = getReleaseNotesByVersion(changelog, changelogUrl)

  const githubReleases = await ctx.client.list()
  const plan = getReleasePlan({
    githubReleases,
    releaseNotesByVersion,
    packageName: packageJson.name,
    hasMultiplePackages: ctx.hasMultiplePackages,
  })
  await applyReleasePlan(plan, ctx.client, ctx.defaultBranch, ctx.dryRun)
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
