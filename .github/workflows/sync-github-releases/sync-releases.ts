// Keeps GitHub releases aligned with `CHANGELOG.md`.
// => It derives release notes from `CHANGELOG.md`, creates the current release if needed (and any missing releases), and updates existing releases whose published notes are outdated (e.g. if CHANGELOG.md was manually edited).

export { getReleasePlan }
export { getReleaseSections }
export { getDefaultBranch }
export { getRepository }

import assert from 'node:assert'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { setTimeout } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
const require = createRequire(import.meta.url)
const { version } = require('../../../packages/vike/package.json') as { version: string }

type Release = {
  id: number
  tag_name: string
  body: string | null
}
type ReleaseSections = Record<string, string>
type ReleaseCreateInput = {
  tag_name: string
  target_commitish: string
  name: string
  body: string
}
type ReleaseUpdateInput = {
  release_id: number
  tag_name: string
  body: string
}

async function main(): Promise<void> {
  // Local testing:
  // GITHUB_TOKEN=<contents:write token> bun ./.github/workflows/sync-github-releases/sync-releases.ts
  // Dry-run (no GitHub token needed):
  // bun ./.github/workflows/sync-github-releases/sync-releases.ts --dry-run
  const dryRun = process.argv.includes('--dry-run')
  const { owner, repo } = getRepository()
  const defaultBranch = getDefaultBranch()
  const versionTag = `v${version}`
  const changelog = await readRepositoryFile('packages/vike/CHANGELOG.md')
  const sections = getReleaseSections(changelog)

  if (dryRun) {
    console.log(`Dry-run mode — no GitHub API calls will be made.`)
    console.log(`Repository: ${owner}/${repo}`)
    console.log(`Version tag: ${versionTag}`)
    console.log(`Changelog sections found: ${Object.keys(sections).join(', ')}`)
    assert(sections[versionTag], `Missing changelog entry for ${versionTag}`)
    console.log(`\nRelease notes for ${versionTag}:\n${sections[versionTag]}`)
    return
  }

  const token = getGithubToken()

  const releases = await getAllReleases(owner, repo, token)

  if (releases.length === 0) {
    // Publish releases that are in CHANGELOG but not published
    // Create release from oldest to newest, so that the release list
    // is sorted by creation date in the same order as the changelog sections
    const allTagReleasesToCreate = Object.keys(sections).reverse()
    for (const tagName of allTagReleasesToCreate) {
      await githubRequest(`/repos/${owner}/${repo}/releases`, {
        token,
        method: 'POST',
        body: {
          name: tagName,
          tag_name: tagName,
          target_commitish: defaultBranch,
          body: sections[tagName],
        },
      })
      console.log(`Created release ${tagName}`)
      // Avoid hitting GitHub abuse rate limits
      await setTimeout(500)
    }
  } else {
    const { releaseToCreate, releasesToUpdate } = getReleasePlan({ defaultBranch, releases, sections, versionTag })

    if (releaseToCreate) {
      // https://docs.github.com/en/rest/releases/releases#create-a-release
      await githubRequest(`/repos/${owner}/${repo}/releases`, {
        token,
        method: 'POST',
        body: releaseToCreate,
      })
      console.log(`Created release ${versionTag}`)
    }

    for (const release of releasesToUpdate) {
      // https://docs.github.com/en/rest/releases/releases#update-a-release
      await githubRequest(`/repos/${owner}/${repo}/releases/${release.release_id}`, {
        token,
        method: 'PATCH',
        body: { body: release.body },
      })
      console.log(`Updated release ${release.tag_name}`)
      // Avoid hitting GitHub abuse rate limits
      await setTimeout(500)
    }
  }
}

async function getAllReleases(owner: string, repo: string, token: string): Promise<Release[]> {
  const allReleases: Release[] = []
  let page = 1
  const perPage = 100

  while (true) {
    // https://docs.github.com/en/rest/releases/releases#list-releases
    const releases = await githubRequest<Release[]>(
      `/repos/${owner}/${repo}/releases?per_page=${perPage}&page=${page}`,
      { token }
    )

    if (releases.length === 0) break

    allReleases.push(...releases)

    if (releases.length < perPage) break

    page++

    await setTimeout(500)
  }

  return allReleases
}

function getReleaseSections(changelog: string): ReleaseSections {
  const sections: ReleaseSections = {}
  // Matches changelog headings: `## [0.4.257](...)` or `# [0.1.0-beta.6](...)`
  const regex = /^##? \[(\d+\.\d+\.\d+[^\]]*)\]/gm
  const matches: { version: string; index: number }[] = []

  let match: RegExpExecArray | null
  while ((match = regex.exec(changelog)) !== null) {
    matches.push({ version: match[1], index: match.index })
  }

  matches.forEach((match, index) => {
    const start = changelog.indexOf('\n', match.index)
    const end = matches[index + 1]?.index ?? changelog.length
    const notes = changelog.slice(start, end).trim()
    sections[`v${match.version}`] = notes
  })

  return sections
}

function getReleasePlan({
  defaultBranch,
  releases,
  sections,
  versionTag,
}: {
  defaultBranch: string
  releases: Release[]
  sections: ReleaseSections
  versionTag: string
}): {
  releaseToCreate: ReleaseCreateInput | null
  releasesToUpdate: ReleaseUpdateInput[]
} {
  const currentBody = sections[versionTag]
  assert(currentBody, `Missing changelog entry for ${versionTag}`)

  const releaseToCreate = releases.some((release) => release.tag_name === versionTag)
    ? null
    : {
        tag_name: versionTag,
        target_commitish: defaultBranch,
        name: versionTag,
        body: currentBody,
      }

  const releasesToUpdate = releases.flatMap((release) => {
    const body = sections[release.tag_name]
    if (!body || body === release.body) return []
    return [{ release_id: release.id, tag_name: release.tag_name, body }]
  })

  return { releaseToCreate, releasesToUpdate }
}

function getRepository(): { owner: string; repo: string } {
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

function getGithubToken(): string {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    console.error(
      [
        'GITHUB_TOKEN is not set, run:',
        '  GITHUB_TOKEN=<token> pnpm run run',
        'Or dry-run (no token needed):',
        '  pnpm run try',
      ].join('\n'),
    )
    process.exit(1)
  }
  return token
}

function getDefaultBranch(): string {
  return process.env.GITHUB_DEFAULT_BRANCH ?? 'main'
}

async function readRepositoryFile(relativePath: string): Promise<string> {
  return readFile(path.join(getRepositoryRoot(), relativePath), 'utf8')
}

function getRepositoryRoot(): string {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
}

async function githubRequest<T = void>(
  pathname: string,
  { body, method = 'GET', token }: { body?: unknown; method?: 'GET' | 'PATCH' | 'POST'; token: string },
): Promise<T> {
  const apiUrl = process.env.GITHUB_API_URL ?? 'https://api.github.com'
  const response = await fetch(new URL(pathname, apiUrl), {
    method,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'vike-sync-github-releases-workflow',
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

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  void main()
}
