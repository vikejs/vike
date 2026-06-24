import { describe, expect, it, vi } from 'vitest'
import { createSyncContext, syncPackage } from './sync-package.ts'
import type { Release, ReleasesClient } from '../utils/github.ts'

// syncPackage() reads package.json and CHANGELOG.md from disk; stub both so the test can hand it a
// CHANGELOG.md that parses to zero versions.
vi.mock('node:fs/promises', () => ({
  readFile: async (filePath: string) =>
    filePath.endsWith('package.json') ? '{ "name": "vike" }' : 'A CHANGELOG.md with no version headings.',
}))

function createFakeClient(): { client: ReleasesClient; calls: string[] } {
  const calls: string[] = []
  const client: ReleasesClient = {
    async list() {
      calls.push('list')
      return [{ id: 1, tag_name: 'v1.0.0', body: 'Notes' }] as Release[]
    },
    async create() {
      calls.push('create')
    },
    async update() {
      calls.push('update')
    },
    async delete() {
      calls.push('delete')
    },
  }
  return { client, calls }
}

describe('syncPackage()', () => {
  it('skips the package when its CHANGELOG.md parses to zero versions, touching nothing', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { client, calls } = createFakeClient()
    const context = createSyncContext({
      client,
      owner: 'vikejs',
      repo: 'vike',
      defaultBranch: 'main',
      hasMultiplePackages: false,
    })

    await syncPackage('packages/vike', context)

    // It must not even fetch the releases, let alone delete them: an empty parse is never "delete everything".
    expect(calls).toEqual([])
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('No versions parsed'))
    warn.mockRestore()
  })
})
