export { resolveTargetCommitish }
export { decideTargetCommitish }

import type { ReleaseToCreate } from './release-plan.ts'
import { findReleaseCommit, gitTagExists } from '../utils/git.ts'

// The commit a to-be-created release is tagged at (its GitHub `target_commitish`). Gathers the git
// facts — does the tag already exist, and if not which commit does the changelog history point at —
// and hands them to decideTargetCommitish(), which owns the decision. Deducing the commit (a
// full-history changelog search) is passed as a thunk so it runs only for the one case that needs it.
function resolveTargetCommitish(release: ReleaseToCreate, defaultBranch: string): string {
  const { tag_name: releaseTag, version, isLatest } = release
  return decideTargetCommitish({
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

// Decide the `target_commitish` from the given facts (pure — all git access is injected, so this is
// the part worth unit-testing):
//  - Tag already exists: GitHub uses it and ignores target_commitish — pass the branch as a no-op.
//  - Tag missing on the latest release: hard fail. The just-released version must already be tagged;
//    tagging it now would point at the default branch's HEAD (the wrong commit).
//  - Tag missing on an older (backfilled) release: tag the commit deduced from the changelog history
//    (deduceCommit()), or hard fail if it couldn't be deduced — never silently tag the wrong commit.
function decideTargetCommitish({
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
  // Both refusals open the same way; only the reason they can't proceed differs.
  const refusal = `Refusing to create release ${releaseTag}: its git tag is missing`
  if (isLatest) {
    throw new Error(
      `${refusal}. The latest release must already be tagged — creating it now would tag the wrong commit (the default branch's HEAD).`,
    )
  }
  const deducedCommit = deduceCommit()
  if (!deducedCommit) {
    throw new Error(`${refusal} and its release commit couldn't be deduced from the changelog history.`)
  }
  return deducedCommit
}
