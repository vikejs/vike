// Deletes every GitHub Release.
// Run via the `delete-all` package.json script — see README.md

main()

import { createReleasesClientFromEnv } from './utils/github-env.ts'

async function main(): Promise<void> {
  const { client, owner, repo } = createReleasesClientFromEnv()

  console.log(`Fetching releases for ${owner}/${repo} …`)
  const githubReleases = await client.list()

  // The client logs each deletion (`Deleted release <tag>`).
  console.log(`Starting delete of ${githubReleases.length} releases …`)
  for (const release of githubReleases) {
    await client.delete({ release_id: release.id, tag_name: release.tag_name })
  }

  console.log(`Deleted ${githubReleases.length} releases.`)
}
