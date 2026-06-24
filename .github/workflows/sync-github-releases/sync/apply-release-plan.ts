export { applyReleasePlan }

import type { ReleasePlan, ReleaseToCreate } from './release-plan.ts'
import { findReleaseCommit, gitTagExists } from '../utils/git.ts'
import type { NewRelease, ReleasesClient } from '../utils/github.ts'

// Carry out a plan from getReleasePlan() against GitHub: create, then update, then delete. The client
// gates each write on --dry-run and logs it (see createReleasesClient()); the one thing that must happen
// here, before the client is even called, is resolving each create's target commit — so a dry run still
// surfaces a missing-tag failure or a deduced-commit warning.
async function applyReleasePlan({
  plan,
  client,
  defaultBranch,
}: {
  plan: ReleasePlan
  client: ReleasesClient
  defaultBranch: string
}): Promise<void> {
  for (const release of plan.releasesToCreate) {
    const targetCommitish = resolveTargetCommitish(release, defaultBranch)
    await client.create(buildNewRelease(release, targetCommitish))
  }

  for (const release of plan.releasesToUpdate) await client.update(release)

  for (const release of plan.releasesToDelete) await client.delete(release)
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

// The GitHub create-release payload for one planned release, tagged at the already-resolved commit.
function buildNewRelease(release: ReleaseToCreate, targetCommitish: string): NewRelease {
  return {
    tag_name: release.tag_name,
    name: release.tag_name,
    body: release.body,
    target_commitish: targetCommitish,
    // Only the newest version may be the repo's "Latest". create-release otherwise defaults
    // make_latest=true, so backfilling an older release while a newer one already exists would
    // wrongly mark the old one Latest.
    make_latest: release.isLatest ? 'true' : 'false',
  }
}
