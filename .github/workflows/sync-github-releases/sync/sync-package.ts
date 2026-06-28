export { syncPackage }
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

// The loop-invariant inputs of a sync run, built once in main() and shared across every package.
// owner/repo ride along so each package's changelog URL can be built (see getChangelogUrl); the client
// also binds them internally for its own API calls.
type SyncContext = {
  client: ReleasesClient
  owner: string
  repo: string
  defaultBranch: string
  hasMultiplePackages: boolean
}

// Sync one package: derive its expected releases from CHANGELOG.md (the source of truth), reconcile
// them against the package's existing GitHub Releases into a plan, then apply that plan.
async function syncPackage(packageDir: string, context: SyncContext): Promise<void> {
  const packageName = await readPackageName(packageDir, context)
  const tagScheme = getTagScheme(packageName, context.hasMultiplePackages)
  const changelogNotes = await readChangelogNotes(packageDir)
  if (Object.keys(changelogNotes).length === 0) {
    // A tracked CHANGELOG.md that parses to zero versions points at a parser/format drift, not an
    // intentional removal — so skip the package (loudly) rather than reconcile against an empty version
    // set, which getReleasePlan() would read as "every release is gone from the changelog: delete them all".
    console.warn(`No versions parsed from ${packageDir}/CHANGELOG.md — skipping it.`)
    return
  }
  const changelogUrl = getChangelogUrl(packageDir, context)
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

// A package's npm name, used to namespace its release tags when the repo has several packages. Falls
// back to the repo name for a single, possibly nameless package (e.g. a repo-root package.json that's
// just a workspace holder) — harmless there, since a lone package's tags are the bare `vX.Y.Z` and
// don't use the name. With multiple packages a missing name is fatal: its tags would collide.
async function readPackageName(
  packageDir: string,
  context: Pick<SyncContext, 'hasMultiplePackages' | 'repo'>,
): Promise<string> {
  const { name } = JSON.parse(await readFile(path.resolve(packageDir, 'package.json'), 'utf8')) as { name?: string }
  if (name) return name
  if (!context.hasMultiplePackages) return context.repo
  throw new Error(
    `Cannot sync ${packageDir}/CHANGELOG.md: ${packageDir}/package.json is missing "name", but multiple packages require namespaced tags.`,
  )
}

async function readChangelogNotes(packageDir: string): Promise<ReleaseNotesByVersion> {
  const changelog = await readFile(path.resolve(packageDir, 'CHANGELOG.md'), 'utf8')
  return parseChangelog(changelog)
}

// The GitHub web (blob) URL of the package's CHANGELOG.md, which each release body's footer links back to.
// path.posix.join keeps the URL clean when packageDir is '.' (a repo-root CHANGELOG.md): no `/./`.
function getChangelogUrl(packageDir: string, { owner, repo, defaultBranch }: SyncContext): string {
  return `https://github.com/${owner}/${repo}/blob/${defaultBranch}/${path.posix.join(packageDir, 'CHANGELOG.md')}`
}
