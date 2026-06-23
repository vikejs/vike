export { getReleasePlan }
export { getTagScheme }
export type { ReleasePlan }
export type { ReleaseToCreate }

import type { ReleaseNotesByVersion } from '../utils/changelog.ts'
import type { Release } from '../utils/github.ts'

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

// A package's release-tag scheme, defined in one place so building a tag and recognizing one can't
// drift apart. `build` turns a version into its tag; `owns` reports whether a release tag is this
// package's — i.e. a candidate for deletion once its changelog entry is gone, never another package's
// release nor a tag we don't create (e.g. `nightly`).
//
// A single package keeps the historical bare `vX.Y.Z` tag. Several packages share the repo's tag
// namespace, so their tags are qualified with the package name (e.g. `create-vike-core@0.0.391`) to
// avoid collisions.
type TagScheme = {
  build(version: string): string
  owns(releaseTag: string): boolean
}
function getTagScheme(packageName: string, hasMultiplePackages: boolean): TagScheme {
  if (hasMultiplePackages) {
    const prefix = `${packageName}@`
    return {
      build: (version) => `${prefix}${version}`,
      owns: (releaseTag) => releaseTag.startsWith(prefix),
    }
  }
  return {
    build: (version) => `v${version}`,
    owns: (releaseTag) => /^v\d+\.\d+\.\d+/.test(releaseTag),
  }
}

function getReleasePlan({
  githubReleases,
  releaseNotesByVersion,
  tagScheme,
}: {
  githubReleases: Release[]
  releaseNotesByVersion: ReleaseNotesByVersion
  tagScheme: TagScheme
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
    const releaseTag = tagScheme.build(version)
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
    .filter((release) => tagScheme.owns(release.tag_name) && !expectedTags.has(release.tag_name))
    .map((release) => ({ release_id: release.id, tag_name: release.tag_name }))

  return { releasesToCreate, releasesToUpdate, releasesToDelete }
}
