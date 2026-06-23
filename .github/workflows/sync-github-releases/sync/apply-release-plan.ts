export { applyReleasePlan }

import type { ReleasePlan, ReleaseToCreate } from './release-plan.ts'
import { findReleaseCommit, gitTagExists } from '../utils/git.ts'
import type { ReleasesClient } from '../utils/github.ts'

// Carry out a plan from getReleasePlan() against GitHub: create, then update, then delete. The
// --dry-run gate lives here rather than in the client, so the client stays a plain transport and each
// action is logged the same way whether or not it's actually performed.
async function applyReleasePlan({
  plan,
  client,
  defaultBranch,
  dryRun,
}: {
  plan: ReleasePlan
  client: ReleasesClient
  defaultBranch: string
  dryRun: boolean
}): Promise<void> {
  for (const release of plan.releasesToCreate) {
    // Resolve (and validate) the tag's commit before the dry-run gate, so a dry run still surfaces a
    // missing-tag failure or a deduced-commit warning.
    const targetCommitish = resolveTargetCommitish(release, defaultBranch)
    await applyWrite(dryRun, 'create', release.tag_name, () =>
      client.create({
        tag_name: release.tag_name,
        name: release.tag_name,
        body: release.body,
        target_commitish: targetCommitish,
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

// The commit a to-be-created release is tagged at (its GitHub `target_commitish`):
//  - Tag already exists: GitHub uses it and ignores target_commitish — pass the branch as a no-op.
//  - Tag missing on the latest release: hard fail. The just-released version must already be tagged;
//    tagging it now would point at the default branch's HEAD (the wrong commit).
//  - Tag missing on an older (backfilled) release: tag the commit deduced from the changelog history,
//    or hard fail if it couldn't be deduced — never silently tag the wrong commit.
function resolveTargetCommitish(release: ReleaseToCreate, defaultBranch: string): string {
  const { tag_name: releaseTag, version, isLatest } = release
  if (gitTagExists(releaseTag)) return defaultBranch
  const refusal = `Refusing to create release ${releaseTag}: its git tag is missing`
  if (isLatest) {
    throw new Error(
      `${refusal}. The latest release must already be tagged — creating it now would tag the wrong commit (the default branch's HEAD).`,
    )
  }
  const commit = findReleaseCommit(version)
  if (!commit) {
    throw new Error(`${refusal} and its release commit couldn't be deduced from the changelog history.`)
  }
  console.warn(`Tag ${releaseTag} is missing — creating its release at deduced commit ${commit}`)
  return commit
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
