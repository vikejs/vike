import assert from 'node:assert'
import { execSync } from 'node:child_process'
import { setTimeout } from 'node:timers/promises'

import type { Release } from './types.js'

export async function getAllReleases(owner: string, repo: string, token: string): Promise<Release[]> {
  const allReleases: Release[] = []
  let page = 1
  const perPage = 100

  while (true) {
    // https://docs.github.com/en/rest/releases/releases#list-releases
    const releases = await githubRequest<Release[]>(
      `/repos/${owner}/${repo}/releases?per_page=${perPage}&page=${page}`,
      { token },
    )

    if (releases.length === 0) break

    allReleases.push(...releases)

    if (releases.length < perPage) break

    page++

    await setTimeout(500)
  }

  return allReleases
}

export async function githubRequest<T = void>(
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
  const apiUrl = process.env.GITHUB_API_URL ?? 'https://api.github.com'
  const response = await fetch(new URL(pathname, apiUrl), {
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

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export function getGithubToken(): string {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    throw new Error(
      [
        'GITHUB_TOKEN is not set, run:',
        '  GITHUB_TOKEN=<token> pnpm -C .github/workflows/sync-github-releases run run -- <package-dir>',
        'Or dry-run (read-only token still needed, to fetch existing releases):',
        '  GITHUB_TOKEN=<token> pnpm -C .github/workflows/sync-github-releases run try -- <package-dir>',
      ].join('\n'),
    )
  }
  return token
}

export function getDefaultBranch(): string {
  return process.env.GITHUB_DEFAULT_BRANCH ?? 'main'
}

export function getRepository(): { owner: string; repo: string } {
  const repository = process.env.GITHUB_REPOSITORY ?? getRepositoryFromGit()
  const [owner, repo] = repository.split('/')
  assert(owner && repo, `Invalid GITHUB_REPOSITORY value: ${repository}`)
  return { owner, repo }
}

function getRepositoryFromGit(): string {
  const url = execSync('git remote get-url origin', { encoding: 'utf8' }).trim()
  // Handles both https://github.com/owner/repo.git and git@github.com:owner/repo.git
  const match = url.match(/github\.com[:/](.+?)(?:\.git)?$/)
  assert(match, `Cannot parse GitHub repository from git remote: ${url}`)
  return match[1]
}
