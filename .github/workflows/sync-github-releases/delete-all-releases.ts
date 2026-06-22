// Deletes every GitHub Release.
// Run via the `delete-all` package.json script — see README.md

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await deleteAllReleases().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}

import { fileURLToPath } from 'node:url'
import { deleteRelease, fetchGithubReleases, getGithubToken, getRepository } from './utils/github.ts'

async function deleteAllReleases() {
  const token = getGithubToken()

  const { owner, repo } = getRepository()
  console.log(`Fetching releases for ${owner}/${repo} …`)

  const githubReleases = await fetchGithubReleases(owner, repo, token)

  console.log(`Starting delete of ${githubReleases.length} releases …`)

  for (const release of githubReleases) {
    console.log(`Deleting release ${release.tag_name} (ID: ${release.id}) …`)
    await deleteRelease(owner, repo, token, release.id)
  }

  console.log(`Deleted ${githubReleases.length} releases.`)
}
