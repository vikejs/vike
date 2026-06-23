export { createReleasesClientFromEnv }
export { getDefaultBranch }
export { getPushedFiles }

import assert from 'node:assert'
import { readFileSync } from 'node:fs'
import { git, gitLines } from './git.ts'
import { createReleasesClient, type ReleasesClient } from './github.ts'

// How a run discovers what to act on, as whom, and against which branch: the repository, the auth
// token, the default branch, and — on a push — which files changed. All read from the GitHub Actions
// environment, with fallbacks for local runs. Kept apart from the API client (github.ts), which is
// pure transport and shouldn't care where these values come from.

// A GitHub Releases client for the repository this run targets, wired up from the environment. Returns
// the resolved owner/repo too — callers need them for the web links and log lines that the client
// (pure transport) doesn't expose.
function createReleasesClientFromEnv(): { client: ReleasesClient; owner: string; repo: string } {
  const { owner, repo } = getRepository()
  const client = createReleasesClient({ owner, repo, token: getGithubToken(), apiUrl: getApiUrl() })
  return { client, owner, repo }
}

function getGithubToken(): string {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    throw new Error('GITHUB_TOKEN must be set — see README.md')
  }
  return token
}

// The GitHub REST API base URL. GITHUB_API_URL is provided on GitHub Actions (and points at the right
// host on GitHub Enterprise); fall back to the public API for local runs.
function getApiUrl(): string {
  return process.env.GITHUB_API_URL ?? 'https://api.github.com'
}

function getDefaultBranch(): string {
  return process.env.GITHUB_DEFAULT_BRANCH ?? 'main'
}

function getRepository(): { owner: string; repo: string } {
  // Either source can be malformed, so keep the message source-neutral (it isn't always GITHUB_REPOSITORY).
  const repository = process.env.GITHUB_REPOSITORY ?? getRepositoryFromGit()
  const [owner, repo] = repository.split('/')
  assert(owner && repo, `Cannot parse owner/repo from repository: ${repository}`)
  return { owner, repo }
}

function getRepositoryFromGit(): string {
  const url = git(['remote', 'get-url', 'origin']).trim()
  // Handles both https://github.com/owner/repo.git and git@github.com:owner/repo.git
  const match = url.match(/github\.com[:/](.+?)(?:\.git)?$/)
  assert(match, `Cannot parse GitHub repository from git remote: ${url}`)
  return match[1]
}

// The files the triggering push changed, or null when this isn't a push (manual workflow_dispatch, or
// a local run) — the caller then falls back to syncing every package.
function getPushedFiles(): string[] | null {
  if (process.env.GITHUB_EVENT_NAME !== 'push') return null
  const beforeSha = getCommitBeforePush()
  const headSha = process.env.GITHUB_SHA
  if (!beforeSha || !headSha) return null
  // The SHAs are passed as argv (git() uses no shell), so they can't cause injection.
  return gitLines(['diff', '--name-only', beforeSha, headSha])
}

// The commit the branch pointed at before the push (`github.event.before`). GitHub Actions writes the
// triggering event's payload to the file at GITHUB_EVENT_PATH.
function getCommitBeforePush(): string | null {
  const eventPath = process.env.GITHUB_EVENT_PATH
  if (!eventPath) return null
  const event = JSON.parse(readFileSync(eventPath, 'utf8')) as { before?: string }
  const beforeSha = event.before
  // GitHub uses an all-zero SHA when there's no prior commit (e.g. a branch's first push).
  if (!beforeSha || /^0+$/.test(beforeSha)) return null
  return beforeSha
}
