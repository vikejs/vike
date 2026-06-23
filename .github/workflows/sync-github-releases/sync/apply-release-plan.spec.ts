import { describe, expect, it, vi } from 'vitest'
import { applyReleasePlan } from './apply-release-plan.ts'
import type { ReleasePlan } from './release-plan.ts'
import type { Release, ReleasesClient } from '../utils/github.ts'

describe('applyReleasePlan()', () => {
  // No creates in the plan, so resolveTargetCommitish() (which shells out to git) isn't exercised
  // here. The dry-run gate is shared by all three actions via applyWrite(), so update + delete prove it.
  const plan: ReleasePlan = {
    releasesToCreate: [],
    releasesToUpdate: [{ release_id: 1, tag_name: 'v1.0.0', body: 'Fresh notes' }],
    releasesToDelete: [{ release_id: 2, tag_name: 'v0.9.0' }],
  }

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
})
