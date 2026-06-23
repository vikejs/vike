// Deletes every GitHub Release.
// Run via the `delete-all` package.json script — see README.md

main()

import { createReleasesClient, getGithubToken, getRepository } from './utils/github.ts'

async function main() {
  const { owner, repo } = getRepository()
  const client = createReleasesClient({ owner, repo, token: getGithubToken() })

  console.log(`Fetching releases for ${owner}/${repo} …`)
  const githubReleases = await client.list()

  console.log(`Starting delete of ${githubReleases.length} releases …`)
  for (const release of githubReleases) {
    console.log(`Deleting release ${release.tag_name} (ID: ${release.id}) …`)
    await client.delete(release.id)
  }

  console.log(`Deleted ${githubReleases.length} releases.`)
}
