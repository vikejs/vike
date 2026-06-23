export { applyReleasePlan }

import { resolveTargetCommitish, type ReleasePlan, type ReleaseToCreate } from './release-plan.ts'
import { findReleaseCommit, gitTagExists } from '../utils/git.ts'
import type { ReleasesClient } from '../utils/github.ts'

// Carry out a plan from getReleasePlan() against GitHub: create, then update, then delete. Under
// --dry-run the client logs each write instead of performing it, so the per-action confirmations
// below (which would otherwise claim work that didn't happen) are skipped.
async function applyReleasePlan(
  plan: ReleasePlan,
  client: ReleasesClient,
  defaultBranch: string,
  dryRun: boolean,
): Promise<void> {
  for (const release of plan.releasesToCreate) {
    await client.create({
      tag_name: release.tag_name,
      name: release.tag_name,
      body: release.body,
      target_commitish: resolveCreateTarget(release, defaultBranch),
      // Only the newest version may be the repo's "Latest". create-release otherwise defaults
      // make_latest=true, so backfilling an older release while a newer one already exists would
      // wrongly mark the old one Latest.
      make_latest: release.isLatest ? 'true' : 'false',
    })
    if (!dryRun) console.log(`Created release ${release.tag_name}`)
  }

  for (const release of plan.releasesToUpdate) {
    await client.update(release.release_id, release.body)
    if (!dryRun) console.log(`Updated release ${release.tag_name}`)
  }

  for (const release of plan.releasesToDelete) {
    await client.delete(release.release_id)
    if (!dryRun) console.log(`Deleted release ${release.tag_name}`)
  }
}

// The commit a to-be-created release is tagged at. A release needs a tag to point at; when it's
// missing, GitHub would create it at the default branch's HEAD — the wrong commit for a backfilled
// (older) release. So deduce the real commit from the changelog history and tag that instead.
// resolveTargetCommitish() turns these git facts into the commitish, or refuses rather than tag the
// wrong commit.
function resolveCreateTarget(release: ReleaseToCreate, defaultBranch: string): string {
  const { tag_name: releaseTag, version, isLatest } = release
  const tagExists = gitTagExists(releaseTag)
  const deducedCommit = !tagExists && !isLatest ? findReleaseCommit(version) : null
  if (deducedCommit)
    console.warn(`Tag ${releaseTag} is missing — creating its release at deduced commit ${deducedCommit}`)
  return resolveTargetCommitish({ releaseTag, tagExists, isLatest, deducedCommit, defaultBranch })
}
