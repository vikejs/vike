// Deletes every GitHub Release.
// Run via the `delete-all` package.json script — see README.md

main()

import { deleteRelease, fetchGithubReleases, getGithubToken, getRepository } from './utils/github.ts'

async function main() {
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
