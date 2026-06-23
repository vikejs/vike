import { describe, expect, it, vi } from 'vitest'
import { applyReleasePlan } from './apply-release-plan.ts'
import type { ReleasePlan } from './release-plan.ts'
import type { Release, ReleasesClient } from '../utils/github.ts'
import { findReleaseCommit, gitTagExists } from '../utils/git.ts'

// Creating a release resolves its target commit by shelling out to git; stub that so the create path
// (and its two refuse-to-tag failures) can run without a real repo. update/delete don't touch git.
vi.mock('../utils/git.ts', () => ({ gitTagExists: vi.fn(), findReleaseCommit: vi.fn() }))

function createFakeClient(): { client: ReleasesClient; calls: string[] } {
  const calls: string[] = []
  const client: ReleasesClient = {
    async list() {
      return [] as Release[]
    },
    async create() {
      calls.push('create')
    },
    async update(releaseId) {
      calls.push(`update:${releaseId}`)
    },
    async delete(releaseId) {
      calls.push(`delete:${releaseId}`)
    },
  }
  return { client, calls }
}

describe('applyReleasePlan()', () => {
  // update + delete only (no creates), so the git stub stays untouched. The dry-run gate is shared by
  // all three actions via applyWrite(), so update + delete prove it.
  const plan: ReleasePlan = {
    releasesToCreate: [],
    releasesToUpdate: [{ release_id: 1, tag_name: 'v1.0.0', body: 'Fresh notes' }],
    releasesToDelete: [{ release_id: 2, tag_name: 'v0.9.0' }],
  }

  it('performs each write and logs it', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const { client, calls } = createFakeClient()

    await applyReleasePlan({ plan, client, defaultBranch: 'main', dryRun: false })

    expect(calls).toEqual(['update:1', 'delete:2'])
    expect(log.mock.calls.flat()).toEqual(['Updated release v1.0.0', 'Deleted release v0.9.0'])
    log.mockRestore()
  })

  it('under --dry-run, announces every action but performs no write', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const { client, calls } = createFakeClient()

    await applyReleasePlan({ plan, client, defaultBranch: 'main', dryRun: true })

    expect(calls).toEqual([])
    expect(log.mock.calls.flat()).toEqual([
      '[dry-run] Would update release v1.0.0',
      '[dry-run] Would delete release v0.9.0',
    ])
    log.mockRestore()
  })

  // A create whose git tag is missing must never be tagged at the wrong commit. These two hard fails
  // are the tool's safety guards, and the create path has no e2e net — so they earn a test even though
  // the dry-run gate can't reach them (resolution happens before it, so a dry run still fails fast).
  describe('refuses to create a release whose git tag is missing', () => {
    const createPlan = (isLatest: boolean): ReleasePlan => ({
      releasesToCreate: [{ tag_name: 'v1.0.0', body: 'Notes', version: '1.0.0', isLatest }],
      releasesToUpdate: [],
      releasesToDelete: [],
    })

    it('hard-fails the latest release (it must already be tagged)', async () => {
      vi.mocked(gitTagExists).mockReturnValue(false)
      const { client } = createFakeClient()

      await expect(
        applyReleasePlan({ plan: createPlan(true), client, defaultBranch: 'main', dryRun: false }),
      ).rejects.toThrow(/latest release must already be tagged/)
    })

    it("hard-fails an older release whose commit can't be deduced", async () => {
      vi.mocked(gitTagExists).mockReturnValue(false)
      vi.mocked(findReleaseCommit).mockReturnValue(null)
      const { client } = createFakeClient()

      await expect(
        applyReleasePlan({ plan: createPlan(false), client, defaultBranch: 'main', dryRun: false }),
      ).rejects.toThrow(/couldn't be deduced/)
    })
  })
})
