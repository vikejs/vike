import { afterEach, describe, expect, it, vi } from 'vitest'
import { createReleasesClient } from './github.ts'

// The throttle between writes sleeps via node:timers/promises; no-op it so the test doesn't actually wait.
vi.mock('node:timers/promises', () => ({ setTimeout: () => Promise.resolve() }))

function createClient(dryRun: boolean) {
  return createReleasesClient({
    owner: 'owner',
    repo: 'repo',
    token: 'token',
    apiUrl: 'https://api.github.com',
    dryRun,
  })
}

const newRelease = {
  tag_name: 'v1.0.0',
  name: 'v1.0.0',
  body: 'Notes',
  target_commitish: 'main',
  make_latest: 'true',
} as const

describe('createReleasesClient() writes', () => {
  afterEach(() => vi.restoreAllMocks())

  it('under --dry-run, logs what it would do and sends no request', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 204 }))
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const client = createClient(true)

    await client.create(newRelease)
    await client.update({ release_id: 1, tag_name: 'v0.9.0', body: 'Fresh' })
    await client.delete({ release_id: 2, tag_name: 'v0.8.0' })

    expect(fetchSpy).not.toHaveBeenCalled()
    expect(logSpy.mock.calls.flat()).toEqual([
      '[dry-run] Would create release v1.0.0',
      '[dry-run] Would update release v0.9.0',
      '[dry-run] Would delete release v0.8.0',
    ])
  })

  it('otherwise performs each write and logs it', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 204 }))
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const client = createClient(false)

    await client.create(newRelease)
    await client.update({ release_id: 1, tag_name: 'v0.9.0', body: 'Fresh' })
    await client.delete({ release_id: 2, tag_name: 'v0.8.0' })

    expect(fetchSpy).toHaveBeenCalledTimes(3)
    expect(logSpy.mock.calls.flat()).toEqual([
      'Created release v1.0.0',
      'Updated release v0.9.0',
      'Deleted release v0.8.0',
    ])
  })
})
