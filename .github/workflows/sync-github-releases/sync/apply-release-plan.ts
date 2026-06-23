export { applyReleasePlan }
export { resolveTargetCommitish }

import type { ReleasePlan, ReleaseToCreate } from './release-plan.ts'
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

// The commit a to-be-created release is tagged at. Gathers the git facts and hands them to
// resolveTargetCommitish(), which owns the decision; deducing the commit (a full-history changelog
// search) is passed as a thunk so it runs only for the one case that needs it.
function resolveCreateTarget(release: ReleaseToCreate, defaultBranch: string): string {
  const { tag_name: releaseTag, version, isLatest } = release
  return resolveTargetCommitish({
    releaseTag,
    isLatest,
    tagExists: gitTagExists(releaseTag),
    deduceCommit: () => {
      const commit = findReleaseCommit(version)
      if (commit) console.warn(`Tag ${releaseTag} is missing — creating its release at deduced commit ${commit}`)
      return commit
    },
    defaultBranch,
  })
}

// The commit a to-be-created release should be tagged at (its `target_commitish`).
//  - Tag already exists: GitHub uses it and ignores target_commitish — pass the branch as a no-op.
//  - Tag missing on the latest release: hard fail. The just-released version must already be tagged;
//    tagging it now would point at the default branch's HEAD (the wrong commit).
//  - Tag missing on an older (backfilled) release: tag the commit deduced from the changelog history
//    (deduceCommit()), or hard fail if it couldn't be deduced — never silently tag the wrong commit.
function resolveTargetCommitish({
  releaseTag,
  tagExists,
  isLatest,
  deduceCommit,
  defaultBranch,
}: {
  releaseTag: string
  tagExists: boolean
  isLatest: boolean
  deduceCommit: () => string | null
  defaultBranch: string
}): string {
  if (tagExists) return defaultBranch
  if (isLatest) {
    throw new Error(
      `Refusing to create release ${releaseTag}: its git tag is missing. The latest release must already be tagged — creating it now would tag the wrong commit (the default branch's HEAD).`,
    )
  }
  const deducedCommit = deduceCommit()
  if (!deducedCommit) {
    throw new Error(
      `Refusing to create release ${releaseTag}: its git tag is missing and its release commit couldn't be deduced from the changelog history.`,
    )
  }
  return deducedCommit
}
