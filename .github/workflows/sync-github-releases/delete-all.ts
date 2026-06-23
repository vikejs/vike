// Deletes every GitHub Release.

main()

import { createReleasesClientFromEnv } from './utils/github-env.ts'

async function main() {
  const { client, owner, repo } = createReleasesClientFromEnv()

  console.log(`Fetching releases for ${owner}/${repo} …`)
  const githubReleases = await client.list()

  console.log(`Starting delete of ${githubReleases.length} releases …`)
  for (const release of githubReleases) {
    console.log(`Deleting release ${release.tag_name} (ID: ${release.id}) …`)
    await client.delete(release.id)
  }

  console.log(`Deleted ${githubReleases.length} releases.`)
}
