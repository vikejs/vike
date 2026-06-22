export { fetchGithubReleases }
export { githubRequest }
export { getGithubToken }
export { getDefaultBranch }
export { getRepository }

import assert from 'node:assert'
import { execSync } from 'node:child_process'
import { setTimeout } from 'node:timers/promises'
import type { Release } from './types.js'

const API_URL = process.env.GITHUB_API_URL ?? 'https://api.github.com'
const REPOSITORY = process.env.GITHUB_REPOSITORY ?? getRepositoryFromGit()
const DEFAULT_BRANCH = process.env.GITHUB_DEFAULT_BRANCH ?? 'main'
// Pause between requests so bursts (e.g. backfilling many releases) stay under GitHub's secondary
// rate limit — its burst/concurrency limit, separate from the hourly primary quota.
// https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api
const RATE_LIMIT_DELAY_MS = 500

async function fetchGithubReleases(owner: string, repo: string, token: string): Promise<Release[]> {
  const githubReleases: Release[] = []
  let page = 1
  const perPage = 100

  while (true) {
    // https://docs.github.com/en/rest/releases/releases#list-releases
    const releaseList = await githubRequest<Release[]>(
      `/repos/${owner}/${repo}/releases?per_page=${perPage}&page=${page}`,
      { token },
    )

    if (releaseList.length === 0) break

    githubReleases.push(...releaseList)

    if (releaseList.length < perPage) break

    page++
  }

  return githubReleases
}

async function githubRequest<T = void>(
  pathname: string,
  {
    body,
    method = 'GET',
    token,
    dryRun = false,
  }: {
    body?: unknown
    method?: 'GET' | 'PATCH' | 'POST' | 'DELETE'
    token: string
    dryRun?: boolean
  },
): Promise<T> {
  if (dryRun && method !== 'GET') {
    console.log(`[dry-run] ${method} ${pathname}`)
    if (body !== undefined) console.log(JSON.stringify(body, null, 2))
    return undefined as T
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

  const data = response.status === 204 ? undefined : await response.json()
  await setTimeout(RATE_LIMIT_DELAY_MS)
  return data as T
}

function getGithubToken(): string {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    throw new Error('GITHUB_TOKEN must be set or use --dry-run — see README.md')
  }
  return token
}

function getDefaultBranch(): string {
  return DEFAULT_BRANCH
}

function getRepository(): { owner: string; repo: string } {
  const [owner, repo] = REPOSITORY.split('/')
  assert(owner && repo, `Invalid GITHUB_REPOSITORY value: ${REPOSITORY}`)
  return { owner, repo }
}

function getRepositoryFromGit(): string {
  const url = execSync('git remote get-url origin', { encoding: 'utf8' }).trim()
  // Handles both https://github.com/owner/repo.git and git@github.com:owner/repo.git
  const match = url.match(/github\.com[:/](.+?)(?:\.git)?$/)
  assert(match, `Cannot parse GitHub repository from git remote: ${url}`)
  return match[1]
}
