export { applyReleasePlan }

import { resolveTargetCommitish, type ReleasePlan, type ReleaseToCreate } from './release-plan.ts'
import { findReleaseCommit, gitTagExists } from '../utils/git.ts'
import type { ReleasesClient } from '../utils/github.ts'

// Carry out a plan from getReleasePlan() against GitHub: create, then update, then delete. The
// --dry-run gate lives here rather than in the client, so the client stays a plain transport and each
// action is logged the same way whether or not it's actually performed.
async function applyReleasePlan(
  plan: ReleasePlan,
  client: ReleasesClient,
  defaultBranch: string,
  dryRun: boolean,
): Promise<void> {
  for (const release of plan.releasesToCreate) {
    // Resolve (and validate) the tag's commit before the dry-run gate, so a dry run still surfaces a
    // missing-tag failure or a deduced-commit warning.
    const target_commitish = resolveCreateTarget(release, defaultBranch)
    await applyWrite(dryRun, 'create', release.tag_name, () =>
      client.create({
        tag_name: release.tag_name,
        name: release.tag_name,
        body: release.body,
        target_commitish,
        // Only the newest version may be the repo's "Latest". create-release otherwise defaults
        // make_latest=true, so backfilling an older release while a newer one already exists would
        // wrongly mark the old one Latest.
        make_latest: release.isLatest ? 'true' : 'false',
      }),
    )
  }

  for (const release of plan.releasesToUpdate)
    await applyWrite(dryRun, 'update', release.tag_name, () => client.update(release.release_id, release.body))

  for (const release of plan.releasesToDelete)
    await applyWrite(dryRun, 'delete', release.tag_name, () => client.delete(release.release_id))
}

// Perform one write against GitHub — or, under --dry-run, just announce it. Centralizing the gate here
// keeps create/update/delete from each repeating the dry-run branch, and logs every action once.
const pastTense = { create: 'Created', update: 'Updated', delete: 'Deleted' } as const
async function applyWrite(
  dryRun: boolean,
  action: keyof typeof pastTense,
  releaseTag: string,
  write: () => Promise<void>,
): Promise<void> {
  if (dryRun) {
    console.log(`[dry-run] Would ${action} release ${releaseTag}`)
    return
  }
  await write()
  console.log(`${pastTense[action]} release ${releaseTag}`)
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
