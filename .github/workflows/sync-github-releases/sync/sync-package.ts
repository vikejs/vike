export { syncPackage }
export { createSyncContext }
export type { SyncContext }

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { applyReleasePlan } from './apply-release-plan.ts'
import { getReleasePlan } from './release-plan.ts'
import { getTagScheme, type TagScheme } from './tag-scheme.ts'
import {
  buildReleaseBody,
  parseChangelog,
  type ReleaseBodyByVersion,
  type ReleaseNotesByVersion,
} from '../utils/changelog.ts'
import { getReleaseDate } from '../utils/git.ts'
import type { ReleasesClient } from '../utils/github.ts'

// The loop-invariant inputs of a sync run, built once and shared across packages. owner/repo aren't
// here: the client already binds them, and the changelog URL base bakes them in.
type SyncContext = {
  client: ReleasesClient
  defaultBranch: string
  hasMultiplePackages: boolean
  changelogUrlBase: string
}

// owner/repo are consumed only to bake the changelog URL base; every other field is the context as-is.
function createSyncContext(
  input: Omit<SyncContext, 'changelogUrlBase'> & { owner: string; repo: string },
): SyncContext {
  const { owner, repo, ...context } = input
  return {
    ...context,
    changelogUrlBase: `https://github.com/${owner}/${repo}/blob/${context.defaultBranch}`,
  }
}

// Sync one package: derive its expected releases from CHANGELOG.md (the source of truth), reconcile
// them against the package's existing GitHub Releases into a plan, then apply that plan.
async function syncPackage(packageDir: string, context: SyncContext): Promise<void> {
  const packageName = await readPackageName(packageDir)
  const tagScheme = getTagScheme(packageName, context.hasMultiplePackages)
  const changelogNotes = await readChangelogNotes(packageDir)
  if (Object.keys(changelogNotes).length === 0) {
    // A tracked CHANGELOG.md that parses to zero versions points at a parser/format drift, not an
    // intentional removal — so skip the package (loudly) rather than reconcile against an empty version
    // set, which getReleasePlan() would read as "every release is gone from the changelog: delete them all".
    console.warn(`No versions parsed from ${packageDir}/CHANGELOG.md — skipping it.`)
    return
  }
  const changelogUrl = getChangelogUrl(packageDir, context.changelogUrlBase)
  const releaseBodyByVersion = buildReleaseBodies(changelogNotes, { tagScheme, changelogUrl })
  const githubReleases = await context.client.list()
  const plan = getReleasePlan({ githubReleases, releaseBodyByVersion, tagScheme })
  await applyReleasePlan({ plan, client: context.client, defaultBranch: context.defaultBranch })
}

// Turn each version's parsed changelog notes into the release body we publish (buildReleaseBody()). Separate
// from the disk read (readChangelogNotes()) because each body is stamped with the version's release date,
// which is resolved from git (getReleaseDate()) — something the pure changelog parsing knows nothing of.
function buildReleaseBodies(
  changelogNotes: ReleaseNotesByVersion,
  { tagScheme, changelogUrl }: { tagScheme: TagScheme; changelogUrl: string },
): ReleaseBodyByVersion {
  return Object.fromEntries(
    Object.entries(changelogNotes).map(([version, notes]) => [
      version,
      buildReleaseBody(notes, { releaseDate: getReleaseDate(tagScheme.build(version), version), changelogUrl }),
    ]),
  )
}

async function readPackageName(packageDir: string): Promise<string> {
  const { name } = JSON.parse(await readFile(path.resolve(packageDir, 'package.json'), 'utf8')) as { name: string }
  return name
}

async function readChangelogNotes(packageDir: string): Promise<ReleaseNotesByVersion> {
  const changelog = await readFile(path.resolve(packageDir, 'CHANGELOG.md'), 'utf8')
  return parseChangelog(changelog)
}

// The GitHub web (blob) URL of the package's CHANGELOG.md, which each release body's footer links back to.
// path.posix.join keeps the URL clean when packageDir is '.' (a repo-root CHANGELOG.md): no `/./`.
function getChangelogUrl(packageDir: string, changelogUrlBase: string): string {
  return `${changelogUrlBase}/${path.posix.join(packageDir, 'CHANGELOG.md')}`
}
