/* === WHAT IS THIS?
Keeps GitHub releases aligned with `CHANGELOG.md`: creates any missing releases, and updates any whose body has drifted from the changelog.
*/

/* === FLOW
1. Resolve repository (`owner/repo`), default branch, and the current version tag (from `<package-dir>/package.json`).
2. Parse `<package-dir>/CHANGELOG.md` into per-version sections via `getReleaseSections()`.
3. Sanity-check via `checkLatestRelease()` that the newest changelog section matches the current `package.json` version.
4. Fetch all existing GitHub releases (paginated) via `getAllReleases()`.
5. `getReleasePlan()` computes:
   - `releasesToCreate`: every changelog section that has no matching GitHub release yet, ordered oldest-first so the GitHub release list ends up in the same order as the changelog.
   - `releasesToUpdate`: existing releases whose body drifted from the matching changelog section.
   Both are then applied via authenticated GitHub API calls (POST to create, PATCH to update), throttled to avoid GitHub abuse rate limits.
6. With `--dry-run`, the same pipeline runs end-to-end but the POST/PATCH mutations are logged instead of sent (read-only GETs still execute, so a token is still required, so that the printed plan matches what a real run would do).
*/

// This file is executed by sync-github-releases.yml
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}

// Only used by ./sync-releases.spec.ts
export { getReleasePlan }
export { getReleaseSections }

import assert from 'node:assert'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { setTimeout } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
import type { Release, ReleaseCreateInput, ReleaseSections, ReleaseUpdateInput } from './types'
import { getAllReleases, getDefaultBranch, getGithubToken, getRepository, githubRequest } from './github-utils'

async function main(): Promise<void> {
  const require = createRequire(import.meta.url)

  const args = process.argv.slice(2)
  const packageDir = args[0]
  if (!packageDir) {
    throw new Error('Usage: sync-releases <package-dir> [--dry-run]')
  }

  const packageDirPath = path.join(process.cwd(), packageDir)
  const packageJsonPath = path.join(packageDirPath, 'package.json')
  const changelogPath = path.join(packageDirPath, 'CHANGELOG.md')

  const packageJson = require(packageJsonPath) as { version: string }

  // Local testing:
  // GITHUB_TOKEN=<contents:write token> bun ./.github/workflows/sync-github-releases/sync-releases.ts packages/vike
  // Dry-run (still needs a token for read-only GETs):
  // GITHUB_TOKEN=<contents:read token> bun ./.github/workflows/sync-github-releases/sync-releases.ts packages/vike --dry-run
  const { owner, repo } = getRepository()
  const defaultBranch = getDefaultBranch()
  const versionTag = `v${packageJson.version}`
  const changelog = await readFile(changelogPath, 'utf8')
  const sections = getReleaseSections(changelog)

  checkLatestRelease(versionTag, sections)

  const dryRun = args.includes('--dry-run')
  if (dryRun) console.log(`Dry-run mode — POST/PATCH calls will be logged instead of sent.`)

  const token = getGithubToken()

  const releases = await getAllReleases(owner, repo, token)

  const { releasesToCreate, releasesToUpdate } = getReleasePlan({ defaultBranch, releases, sections })

  for (const releaseToCreate of releasesToCreate) {
    if (dryRun) {
      console.log(`[dry-run] POST /repos/${owner}/${repo}/releases`)
      console.log(JSON.stringify(releaseToCreate, null, 2))
      continue
    }
    // https://docs.github.com/en/rest/releases/releases#create-a-release
    await githubRequest(`/repos/${owner}/${repo}/releases`, {
      token,
      method: 'POST',
      body: releaseToCreate,
    })
    console.log(`Created release ${releaseToCreate.tag_name}`)
    // Avoid hitting GitHub abuse rate limits
    await setTimeout(500)
  }

  for (const releaseToUpdate of releasesToUpdate) {
    if (dryRun) {
      console.log(`[dry-run] PATCH /repos/${owner}/${repo}/releases/${releaseToUpdate.release_id} (${releaseToUpdate.tag_name})`)
      console.log(JSON.stringify({ body: releaseToUpdate.body }, null, 2))
      continue
    }
    // https://docs.github.com/en/rest/releases/releases#update-a-release
    await githubRequest(`/repos/${owner}/${repo}/releases/${releaseToUpdate.release_id}`, {
      token,
      method: 'PATCH',
      body: { body: releaseToUpdate.body },
    })
    console.log(`Updated release ${releaseToUpdate.tag_name}`)
    // Avoid hitting GitHub abuse rate limits
    await setTimeout(500)
  }
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
}: {
  defaultBranch: string
  releases: Release[]
  sections: ReleaseSections
}): {
  releasesToCreate: ReleaseCreateInput[]
  releasesToUpdate: ReleaseUpdateInput[]
} {
  const releasesToCreate: ReleaseCreateInput[] = Object.keys(sections)
    .filter((tagName) => !releases.some((release) => release.tag_name === tagName))
    .reverse()
    .map((tagName) => ({
      tag_name: tagName,
      target_commitish: defaultBranch,
      name: tagName,
      body: sections[tagName],
    }))

  const releasesToUpdate = releases.flatMap((release) => {
    const body = sections[release.tag_name]
    if (!body || body === release.body) return []
    return [{ release_id: release.id, tag_name: release.tag_name, body }]
  })

  return { releasesToCreate, releasesToUpdate }
}

function checkLatestRelease(versionTag: string, sections: ReleaseSections) {
  const latestRelease = Object.keys(sections)[0]
  assert(
    latestRelease === versionTag,
    `The latest changelog entry is ${latestRelease}, but the current version is ${versionTag}`,
  )
  const currentBody = sections[versionTag]
  assert(currentBody, `Missing changelog entry for ${versionTag}`)
}
