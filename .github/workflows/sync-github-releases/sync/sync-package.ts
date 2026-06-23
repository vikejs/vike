export { syncPackage }
export { createSyncContext }
export type { SyncContext }

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { applyReleasePlan } from './apply-release-plan.ts'
import { getReleasePlan } from './release-plan.ts'
import { getTagScheme } from './tag-scheme.ts'
import { getReleaseNotesByVersion, type ReleaseNotesByVersion } from '../utils/changelog.ts'
import type { ReleasesClient } from '../utils/github.ts'

// The loop-invariant inputs of a sync run, built once and shared across packages. owner/repo aren't
// here: the client already binds them, and the changelog URL base bakes them in.
type SyncContext = {
  client: ReleasesClient
  defaultBranch: string
  hasMultiplePackages: boolean
  dryRun: boolean
  changelogUrlBase: string
}

function createSyncContext({
  client,
  owner,
  repo,
  defaultBranch,
  hasMultiplePackages,
  dryRun,
}: {
  client: ReleasesClient
  owner: string
  repo: string
  defaultBranch: string
  hasMultiplePackages: boolean
  dryRun: boolean
}): SyncContext {
  return {
    client,
    defaultBranch,
    hasMultiplePackages,
    dryRun,
    changelogUrlBase: `https://github.com/${owner}/${repo}/blob/${defaultBranch}`,
  }
}

// Sync one package: derive its expected releases from CHANGELOG.md (the source of truth), reconcile
// them against the package's existing GitHub Releases into a plan, then apply that plan.
async function syncPackage(packageDir: string, ctx: SyncContext): Promise<void> {
  const packageName = await readPackageName(packageDir)
  const releaseNotesByVersion = await readReleaseNotes(packageDir, ctx.changelogUrlBase)
  const githubReleases = await ctx.client.list()
  const tagScheme = getTagScheme(packageName, ctx.hasMultiplePackages)
  const plan = getReleasePlan({ githubReleases, releaseNotesByVersion, tagScheme })
  await applyReleasePlan({ plan, client: ctx.client, defaultBranch: ctx.defaultBranch, dryRun: ctx.dryRun })
}

async function readPackageName(packageDir: string): Promise<string> {
  const { name } = JSON.parse(await readFile(path.resolve(packageDir, 'package.json'), 'utf8')) as { name: string }
  return name
}

async function readReleaseNotes(packageDir: string, changelogUrlBase: string): Promise<ReleaseNotesByVersion> {
  const changelog = await readFile(path.resolve(packageDir, 'CHANGELOG.md'), 'utf8')
  // path.posix.join keeps the URL clean when packageDir is '.' (a repo-root CHANGELOG.md): no `/./`.
  const changelogUrl = `${changelogUrlBase}/${path.posix.join(packageDir, 'CHANGELOG.md')}`
  return getReleaseNotesByVersion(changelog, changelogUrl)
}
