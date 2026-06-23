export { getReleasePlan }
export { getReleaseTag }
export { resolveTargetCommitish }
export type { ReleasePlan }
export type { ReleaseToCreate }

import type { ReleaseNotesByVersion } from './utils/changelog.ts'
import type { Release } from './utils/github.ts'

type ReleasePlan = {
  releasesToCreate: ReleaseToCreate[]
  releasesToUpdate: ReleaseToUpdate[]
  releasesToDelete: ReleaseToDelete[]
}
type ReleaseToCreate = {
  tag_name: string
  body: string
  // Carried for the apply step (apply-release-plan.ts): the raw version locates the release commit
  // when its tag is missing, and isLatest decides the GitHub "Latest" badge.
  version: string
  isLatest: boolean
}
type ReleaseToUpdate = {
  release_id: number
  tag_name: string
  body: string
}
type ReleaseToDelete = {
  release_id: number
  tag_name: string
}

// A version's git tag. A single package keeps the historical bare `vX.Y.Z` tag. Several packages share
// the repo's tag namespace, so their tags are qualified with the package name (e.g.
// `create-vike-core@0.0.391`) to avoid collisions.
function getReleaseTag(version: string, packageName: string, hasMultiplePackages: boolean): string {
  if (hasMultiplePackages) return `${packageName}@${version}`
  return `v${version}`
}

// Whether a GitHub Release tag belongs to the package being synced — i.e. is a candidate for
// deletion once its changelog entry is gone. Mirrors getReleaseTag()'s two schemes, so a release of
// another package (or a tag we never created, e.g. `nightly`) is never deleted.
function isOwnedTag(releaseTag: string, packageName: string, hasMultiplePackages: boolean): boolean {
  if (hasMultiplePackages) return releaseTag.startsWith(`${packageName}@`)
  return /^v\d+\.\d+\.\d+/.test(releaseTag)
}

// The commit a to-be-created release should be tagged at (its `target_commitish`).
//  - Tag already exists: GitHub uses it and ignores target_commitish — pass the branch as a no-op.
//  - Tag missing on the latest release: hard fail. The just-released version must already be tagged;
//    tagging it now would point at the default branch's HEAD (the wrong commit).
//  - Tag missing on an older (backfilled) release: tag the commit deduced from the changelog history,
//    or hard fail if it couldn't be deduced — never silently tag the wrong commit.
function resolveTargetCommitish({
  releaseTag,
  tagExists,
  isLatest,
  deducedCommit,
  defaultBranch,
}: {
  releaseTag: string
  tagExists: boolean
  isLatest: boolean
  deducedCommit: string | null
  defaultBranch: string
}): string {
  if (tagExists) return defaultBranch
  if (isLatest) {
    throw new Error(
      `Refusing to create release ${releaseTag}: its git tag is missing. The latest release must already be tagged — creating it now would tag the wrong commit (the default branch's HEAD).`,
    )
  }
  if (!deducedCommit) {
    throw new Error(
      `Refusing to create release ${releaseTag}: its git tag is missing and its release commit couldn't be deduced from the changelog history.`,
    )
  }
  return deducedCommit
}

function getReleasePlan({
  githubReleases,
  releaseNotesByVersion,
  packageName,
  hasMultiplePackages,
}: {
  githubReleases: Release[]
  releaseNotesByVersion: ReleaseNotesByVersion
  packageName: string
  hasMultiplePackages: boolean
}): ReleasePlan {
  // Reconcile from the changelog (the source of truth), not from the GitHub Releases: iterating the
  // releases for updates would try to rewrite any release whose tag isn't in the changelog (e.g. a
  // release of another package, or a manually-created one) with an `undefined` body. Driving both
  // create and update off the changelog can only ever touch the versions the changelog declares.
  const releasesByTag = new Map(githubReleases.map((release) => [release.tag_name, release]))
  const expectedTags = new Set<string>()
  const releasesToCreate: ReleaseToCreate[] = []
  const releasesToUpdate: ReleaseToUpdate[] = []

  // releaseNotesByVersion is newest-first; the newest version is the one eligible to be the repo's
  // "Latest". Capture it before reversing.
  const versions = Object.keys(releaseNotesByVersion)
  const latestVersion = versions[0]

  // Iterate oldest-first so releases are created (and their notifications sent) in chronological
  // order. Which release is "Latest" is set explicitly (isLatest), not inferred from creation order.
  // (GitHub orders the releases list by tag semver regardless:
  // https://github.com/vikejs/vike/pull/3157#issuecomment-4406846257)
  for (const version of [...versions].reverse()) {
    const body = releaseNotesByVersion[version]
    const releaseTag = getReleaseTag(version, packageName, hasMultiplePackages)
    expectedTags.add(releaseTag)
    const existingRelease = releasesByTag.get(releaseTag)
    if (!existingRelease) {
      releasesToCreate.push({ tag_name: releaseTag, body, version, isLatest: version === latestVersion })
    } else if (existingRelease.body?.trim() !== body) {
      releasesToUpdate.push({ release_id: existingRelease.id, tag_name: releaseTag, body })
    }
  }

  // Delete this package's releases whose version is no longer in the changelog (the source of truth).
  const releasesToDelete: ReleaseToDelete[] = githubReleases
    .filter(
      (release) =>
        isOwnedTag(release.tag_name, packageName, hasMultiplePackages) && !expectedTags.has(release.tag_name),
    )
    .map((release) => ({ release_id: release.id, tag_name: release.tag_name }))

  return { releasesToCreate, releasesToUpdate, releasesToDelete }
}
