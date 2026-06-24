export { getReleasePlan }
export type { ReleasePlan }
export type { ReleaseToCreate }

import type { ReleaseBodyByVersion } from '../utils/changelog.ts'
import type { Release } from '../utils/github.ts'
import type { TagScheme } from './tag-scheme.ts'

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

function getReleasePlan({
  githubReleases,
  releaseBodyByVersion,
  tagScheme,
}: {
  githubReleases: Release[]
  releaseBodyByVersion: ReleaseBodyByVersion
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

  // releaseBodyByVersion is newest-first; the newest version is the one eligible to be the repo's
  // "Latest". Capture it before reversing.
  const versions = Object.keys(releaseBodyByVersion)
  const latestVersion = versions[0]

  // Iterate oldest-first so releases are created (and their notifications sent) in chronological
  // order. Which release is "Latest" is set explicitly (isLatest), not inferred from creation order.
  // (GitHub orders the releases list by tag semver regardless:
  // https://github.com/vikejs/vike/pull/3157#issuecomment-4406846257)
  for (const version of [...versions].reverse()) {
    const body = releaseBodyByVersion[version]
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
