import { describe, expect, it, vi } from 'vitest'
import { applyReleasePlan } from './apply-release-plan.ts'
import type { ReleasePlan } from './release-plan.ts'
import type { Release, ReleasesClient } from '../utils/github.ts'
import { findReleaseCommit, gitTagExists } from '../utils/git.ts'

// Creating a release resolves its target commit by shelling out to git; stub that so the create path
// (and its two refuse-to-tag failures) can run without a real repo. update/delete don't touch git.
vi.mock('../utils/git.ts', () => ({ gitTagExists: vi.fn(), findReleaseCommit: vi.fn() }))

// The --dry-run gate and the per-write logging live in the client now (see github.spec.ts); this fake
// just records which writes the plan drives, in which order.
function createFakeClient(): { client: ReleasesClient; calls: string[] } {
  const calls: string[] = []
  const client: ReleasesClient = {
    async list() {
      return [] as Release[]
    },
    async create() {
      calls.push('create')
    },
    async update(release) {
      calls.push(`update:${release.release_id}`)
    },
    async delete(release) {
      calls.push(`delete:${release.release_id}`)
    },
  }
  return { client, calls }
}

describe('applyReleasePlan()', () => {
  it('issues each write to the client', async () => {
    const { client, calls } = createFakeClient()

    await applyReleasePlan({
      plan: {
        releasesToCreate: [],
        releasesToUpdate: [{ release_id: 1, tag_name: 'v1.0.0', body: 'Fresh notes' }],
        releasesToDelete: [{ release_id: 2, tag_name: 'v0.9.0' }],
      },
      client,
      defaultBranch: 'main',
    })

    expect(calls).toEqual(['update:1', 'delete:2'])
  })

  // A create whose git tag is missing must never be tagged at the wrong commit. These two hard fails are
  // the tool's safety guards, and the create path has no e2e net — so they earn a test. Resolution runs
  // before the client is called, so even a dry run fails fast.
  describe('refuses to create a release whose git tag is missing', () => {
    const createPlan = (isLatest: boolean): ReleasePlan => ({
      releasesToCreate: [{ tag_name: 'v1.0.0', body: 'Notes', version: '1.0.0', isLatest }],
      releasesToUpdate: [],
      releasesToDelete: [],
    })

    it('hard-fails the latest release (it must already be tagged)', async () => {
      vi.mocked(gitTagExists).mockReturnValue(false)
      const { client } = createFakeClient()

      await expect(applyReleasePlan({ plan: createPlan(true), client, defaultBranch: 'main' })).rejects.toThrow(
        /latest release must already be tagged/,
      )
    })

    it("hard-fails an older release whose commit can't be deduced", async () => {
      vi.mocked(gitTagExists).mockReturnValue(false)
      vi.mocked(findReleaseCommit).mockReturnValue(null)
      const { client } = createFakeClient()

      await expect(applyReleasePlan({ plan: createPlan(false), client, defaultBranch: 'main' })).rejects.toThrow(
        /couldn't be deduced/,
      )
    })
  })
})
