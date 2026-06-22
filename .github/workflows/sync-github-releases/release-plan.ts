export { getReleasePlan }
export { getReleaseTag }
export { withSourceOfTruth }
export { chooseCreateCommitish }

import type { ChangelogSections } from './utils/changelog.ts'
import type { Release } from './utils/github.ts'

type ReleaseToCreate = {
  tag_name: string
  name: string
  body: string
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

// The git tag / GitHub Release tag for a changelog version. A single package keeps the historical
// bare `vX.Y.Z`. Several packages share the repo's tag namespace, so their tags are qualified with
// the package name (e.g. `create-vike-core@0.0.391`) to avoid collisions.
function getReleaseTag(versionTag: string, packageName: string, multiplePackages: boolean): string {
  if (!multiplePackages) return versionTag
  return `${packageName}@${versionTag.replace(/^v/, '')}`
}

// Whether a GitHub Release tag belongs to the package being synced — i.e. is a candidate for
// deletion once its changelog entry is gone. Mirrors getReleaseTag()'s two schemes, so a release of
// another package (or a tag we never created, e.g. `nightly`) is never deleted.
function isOwnedTag(releaseTag: string, packageName: string, multiplePackages: boolean): boolean {
  if (multiplePackages) return releaseTag.startsWith(`${packageName}@`)
  return /^v\d+\.\d+\.\d+/.test(releaseTag)
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
  releaseTag,
  tagExists,
  isNewest,
  deducedCommit,
  defaultBranch,
}: {
  releaseTag: string
  tagExists: boolean
  isNewest: boolean
  deducedCommit: string | null
  defaultBranch: string
}): string {
  if (tagExists) return defaultBranch
  if (isNewest) {
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
  changelogSections,
  packageName,
  multiplePackages,
}: {
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
  const releasesToCreate: ReleaseToCreate[] = []
  const releasesToUpdate: ReleaseToUpdate[] = []

  // changelogSections is newest-first; iterate oldest-first so releases are created (and their
  // notifications sent) in chronological order. Which release is "Latest" is set explicitly via
  // make_latest in syncPackage, not inferred from creation order. (GitHub orders the releases list by
  // tag semver regardless: https://github.com/vikejs/vike/pull/3157#issuecomment-4406846257)
  for (const versionTag of Object.keys(changelogSections).reverse()) {
    const body = changelogSections[versionTag]
    const releaseTag = getReleaseTag(versionTag, packageName, multiplePackages)
    expectedTags.add(releaseTag)
    const existingRelease = releasesByTag.get(releaseTag)
    if (!existingRelease) {
      releasesToCreate.push({ tag_name: releaseTag, name: releaseTag, body })
    } else if (existingRelease.body?.trim() !== body) {
      releasesToUpdate.push({ release_id: existingRelease.id, tag_name: releaseTag, body })
    }
  }

  // Delete this package's releases whose version is no longer in the changelog (the source of truth).
  const releasesToDelete: ReleaseToDelete[] = githubReleases
    .filter(
      (release) => isOwnedTag(release.tag_name, packageName, multiplePackages) && !expectedTags.has(release.tag_name),
    )
    .map((release) => ({ release_id: release.id, tag_name: release.tag_name }))

  return { releasesToCreate, releasesToUpdate, releasesToDelete }
}
