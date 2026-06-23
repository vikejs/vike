export { applyReleasePlan }

import type { ReleasePlan } from './release-plan.ts'
import { resolveTargetCommitish } from './target-commitish.ts'
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
