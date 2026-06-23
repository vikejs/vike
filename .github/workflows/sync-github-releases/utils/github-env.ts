export { getGithubToken }
export { getDefaultBranch }
export { getRepository }

import assert from 'node:assert'
import { git } from './git.ts'

// How a run discovers what to act on, as whom, and against which branch: the repository, the auth
// token, and the default branch — read from the GitHub Actions environment, with fallbacks for local
// runs. Kept apart from the API client (github.ts), which is pure transport and shouldn't care where
// these values come from.

function getGithubToken(): string {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    throw new Error('GITHUB_TOKEN must be set — see README.md')
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
