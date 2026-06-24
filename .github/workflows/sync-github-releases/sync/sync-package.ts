export { syncPackage }
export { createSyncContext }
export type { SyncContext }

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { applyReleasePlan } from './apply-release-plan.ts'
import { getReleasePlan } from './release-plan.ts'
import { getTagScheme, type TagScheme } from './tag-scheme.ts'
import { buildReleaseBody, parseChangelog, type ReleaseNotesByVersion } from '../utils/changelog.ts'
import { getReleaseDate } from '../utils/git.ts'
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
async function syncPackage(packageDir: string, ctx: SyncContext): Promise<void> {
  const packageName = await readPackageName(packageDir)
  const tagScheme = getTagScheme(packageName, ctx.hasMultiplePackages)
  const changelogNotes = await readChangelogNotes(packageDir)
  const releaseNotesByVersion = buildReleaseBodies(changelogNotes, {
    tagScheme,
    changelogUrl: getChangelogUrl(packageDir, ctx.changelogUrlBase),
  })
  const githubReleases = await ctx.client.list()
  const plan = getReleasePlan({ githubReleases, releaseNotesByVersion, tagScheme })
  await applyReleasePlan({ plan, client: ctx.client, defaultBranch: ctx.defaultBranch, dryRun: ctx.dryRun })
}

// Turn each version's parsed changelog notes into the release body we publish (buildReleaseBody()). Kept
// out of the disk read (readChangelogNotes()) because the release date is resolved from git — the tag
// scheme turns a version into its tag (getReleaseDate()) — which the pure changelog parsing knows nothing of.
function buildReleaseBodies(
  changelogNotes: ReleaseNotesByVersion,
  { tagScheme, changelogUrl }: { tagScheme: TagScheme; changelogUrl: string },
): ReleaseNotesByVersion {
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
