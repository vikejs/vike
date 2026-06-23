export { createReleasesClient }
export { getGithubToken }
export { getDefaultBranch }
export { getRepository }
export type { Release }
export type { ReleasesClient }

import assert from 'node:assert'
import { setTimeout } from 'node:timers/promises'
import { git } from './git.ts'

// The fields we use of a GitHub Release (https://docs.github.com/en/rest/releases/releases).
type Release = {
  id: number
  tag_name: string
  body: string | null
}

type NewRelease = {
  tag_name: string
  target_commitish: string
  name: string
  body: string
  make_latest: 'true' | 'false'
}

// A client for one repository's GitHub Releases. It binds the owner/repo/token (and --dry-run) once,
// so callers just say what to do — not where, nor as whom.
type ReleasesClient = {
  list(): Promise<Release[]>
  create(release: NewRelease): Promise<void>
  update(releaseId: number, body: string): Promise<void>
  delete(releaseId: number): Promise<void>
}

const API_URL = process.env.GITHUB_API_URL ?? 'https://api.github.com'
// Pause between write requests so bursts (e.g. backfilling many releases) stay under GitHub's
// secondary rate limit — its burst/concurrency limit, separate from the hourly primary quota.
// https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api
const RATE_LIMIT_DELAY_MS = 500

function createReleasesClient({
  owner,
  repo,
  token,
  dryRun = false,
}: {
  owner: string
  repo: string
  token: string
  dryRun?: boolean
}): ReleasesClient {
  const releasesPath = `/repos/${owner}/${repo}/releases`
  // Writes performed so far, to delay only *between* them (not before the first, nor after reads).
  let writeCount = 0

  async function request<T = void>(
    pathname: string,
    { body, method = 'GET' }: { body?: unknown; method?: 'GET' | 'PATCH' | 'POST' | 'DELETE' } = {},
  ): Promise<T> {
    if (dryRun && method !== 'GET') {
      console.log(`[dry-run] ${method} ${pathname}`)
      if (body !== undefined) console.log(JSON.stringify(body, null, 2))
      return undefined as T
    }

    // Throttle between writes only: reads aren't the rate-limit concern, and a lone write — the common
    // case of a single new release — shouldn't wait at all. So a backfill of N writes pays N-1 delays,
    // while one write pays none.
    if (method !== 'GET') {
      if (writeCount > 0) await setTimeout(RATE_LIMIT_DELAY_MS)
      writeCount++
    }

    const response = await fetch(new URL(pathname, API_URL), {
      method,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'sync-github-releases-workflow',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(
        `GitHub API request failed (${method} ${pathname}): ${response.status} ${response.statusText}\n${errorBody}`,
      )
    }

    return response.status === 204 ? (undefined as T) : ((await response.json()) as T)
  }

  return {
    // https://docs.github.com/en/rest/releases/releases#list-releases
    async list(): Promise<Release[]> {
      const releases: Release[] = []
      const perPage = 100
      // Keep paging until a short (or empty) page signals the end.
      for (let page = 1; ; page++) {
        const pageReleases = await request<Release[]>(`${releasesPath}?per_page=${perPage}&page=${page}`)
        releases.push(...pageReleases)
        if (pageReleases.length < perPage) return releases
      }
    },
    // https://docs.github.com/en/rest/releases/releases#create-a-release
    create(release: NewRelease): Promise<void> {
      return request(releasesPath, { method: 'POST', body: release })
    },
    // https://docs.github.com/en/rest/releases/releases#update-a-release
    update(releaseId: number, body: string): Promise<void> {
      return request(`${releasesPath}/${releaseId}`, { method: 'PATCH', body: { body } })
    },
    // https://docs.github.com/en/rest/releases/releases#delete-a-release
    delete(releaseId: number): Promise<void> {
      return request(`${releasesPath}/${releaseId}`, { method: 'DELETE' })
    },
  }
}

function getGithubToken(): string {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    throw new Error('GITHUB_TOKEN must be set or use --dry-run — see README.md')
  }
  return token
}

function getDefaultBranch(): string {
  return process.env.GITHUB_DEFAULT_BRANCH ?? 'main'
}

function getRepository(): { owner: string; repo: string } {
  const repository = process.env.GITHUB_REPOSITORY ?? getRepositoryFromGit()
  const [owner, repo] = repository.split('/')
  assert(owner && repo, `Invalid GITHUB_REPOSITORY value: ${repository}`)
  return { owner, repo }
}

function getRepositoryFromGit(): string {
  const url = git(['remote', 'get-url', 'origin']).trim()
  // Handles both https://github.com/owner/repo.git and git@github.com:owner/repo.git
  const match = url.match(/github\.com[:/](.+?)(?:\.git)?$/)
  assert(match, `Cannot parse GitHub repository from git remote: ${url}`)
  return match[1]
}
