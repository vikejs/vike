// Keeps GitHub releases aligned with `CHANGELOG.md` for the current package version:
// it derives release notes from the changelog, creates the current release if needed,
// and updates existing releases whose published notes are stale.

export { getReleasePlan }
export { getReleaseSections }
export { getDefaultBranch }
export { getRepository }

import assert from 'node:assert'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
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

function getReleaseSections(changelog: string): ReleaseSections {
  const sections: ReleaseSections = {}
  const regex = /^##? \[(\d+\.\d+\.\d+)\]/gm
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

async function main(): Promise<void> {
  // Local testing:
  // GITHUB_TOKEN=<contents:write token> bun ./.github/workflows/sync-github-releases/sync-releases.ts
  const { owner, repo } = getRepository()
  const token = getEnv('GITHUB_TOKEN')
  const defaultBranch = getDefaultBranch()
  const versionTag = `v${version}`
  const changelog = await readRepositoryFile('CHANGELOG.md')
  const sections = getReleaseSections(changelog)

  // https://docs.github.com/en/rest/releases/releases#list-releases
  const releases = await githubRequest<Release[]>(`/repos/${owner}/${repo}/releases?per_page=100`, {
    token,
  })

  if (releases.length === 0) {
    // Pulbish releases that are in CHANGELOG but not published
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
          body: sections[tagName]
        }
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

function getRepository(): { owner: string; repo: string } {
  const repository = process.env.GITHUB_REPOSITORY ?? 'vikejs/vike'
  const [owner, repo] = repository.split('/')
  assert(owner && repo, `Invalid GITHUB_REPOSITORY value: ${repository}`)
  return { owner, repo }
}

function getDefaultBranch(): string {
  return process.env.GITHUB_DEFAULT_BRANCH ?? 'main'
}

function getEnv(name: string): string {
  const value = process.env[name]
  assert(value, `Missing environment variable ${name}`)
  return value
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
