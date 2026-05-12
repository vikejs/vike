/* === WHAT IS THIS?
Keeps GitHub releases aligned with `CHANGELOG.md`: creates any missing releases, and updates any whose body has drifted from the changelog.
*/

/* === FLOW
1. Read CHANGELOG.md and parse the changelog sections.
2. Fetch existing GitHub releases.
3. getReleasePlan() compares the changelog sections against the GitHub releases, to determine which need to be created and which need their body updated.
   i. Build `releasesToCreate` from changelog tags that don't exist on GitHub yet, reverse them so missing past releases are created oldest-first, and use the changelog section as the release body.
   ii. Build `releasesToUpdate` from existing GitHub releases that still have a changelog entry but whose trimmed body no longer matches that changelog section.
4. Apply the plan via the GitHub API (or, in `--dry-run`, log what would be done).
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
export { parseChangelog }

import assert from 'node:assert'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Release } from './types'
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
  const sections = parseChangelog(changelog)
  assertChangelog(versionTag, sections)

  const token = getGithubToken()

  const releases = await getAllReleases(owner, repo, token)

  const { releasesToCreate, releasesToUpdate } = getReleasePlan({ defaultBranch, releases, sections })

  const dryRun = args.includes('--dry-run')
  for (const releaseToCreate of releasesToCreate) {
    // https://docs.github.com/en/rest/releases/releases#create-a-release
    await githubRequest(`/repos/${owner}/${repo}/releases`, {
      token,
      method: 'POST',
      body: releaseToCreate,
      dryRun,
    })
    if (!dryRun) console.log(`Created release ${releaseToCreate.tag_name}`)
  }

  for (const releaseToUpdate of releasesToUpdate) {
    // https://docs.github.com/en/rest/releases/releases#update-a-release
    await githubRequest(`/repos/${owner}/${repo}/releases/${releaseToUpdate.release_id}`, {
      token,
      method: 'PATCH',
      body: { body: releaseToUpdate.body },
      dryRun,
    })
    if (!dryRun) console.log(`Updated release ${releaseToUpdate.tag_name}`)
  }
}

type ChangelogSections = Record<string, string>
function parseChangelog(changelog: string): ChangelogSections {
  // TODO/ai rename the variable `sections` to `changelogSections` everywhere
  const sections: ChangelogSections = {}
  // Matches changelog headings: `## [0.4.257](...)` or `# [0.1.0-beta.6](...)`
  const matches = [...changelog.matchAll(/^##? \[(\d+\.\d+\.\d+[^\]]*)\]/gm)]

  matches.forEach((match, index) => {
    const start = changelog.indexOf('\n', match.index)
    const end = matches[index + 1]?.index ?? changelog.length
    const notes = changelog.slice(start, end).trim()
    sections[`v${match[1]}`] = notes
  })

  return sections
}
function assertChangelog(versionTag: string, sections: ChangelogSections) {
  const latestRelease = Object.keys(sections)[0]
  assert(
    latestRelease === versionTag,
    `The latest changelog entry is ${latestRelease}, but the current version is ${versionTag}`,
  )
  const currentBody = sections[versionTag]
  assert(currentBody, `Missing changelog entry for ${versionTag}`)
}

type ReleasesToCreate = {
  tag_name: string
  target_commitish: string
  name: string
  body: string
}
type ReleasesToUpdate = {
  release_id: number
  tag_name: string
  body: string
}
function getReleasePlan({
  defaultBranch,
  releases,
  sections,
}: {
  defaultBranch: string
  releases: Release[]
  sections: ChangelogSections
}) {
  const releasesToCreate: ReleasesToCreate[] = Object.keys(sections)
    .filter((tagName) => !releases.some((release) => release.tag_name === tagName))
    .reverse()
    .map((tagName) => ({
      tag_name: tagName,
      target_commitish: defaultBranch,
      name: tagName,
      body: sections[tagName],
    }))

  const releasesToUpdate: ReleasesToUpdate[] = releases.flatMap((release) => {
    const body = sections[release.tag_name]
    if (!body || body === release.body?.trim()) return []
    return [{ release_id: release.id, tag_name: release.tag_name, body }]
  })

  return { releasesToCreate, releasesToUpdate }
}
