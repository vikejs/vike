// Example usage:
// GITHUB_TOKEN=<contents:write token> bun ./.github/workflows/sync-github-releases/remove-all-releases.ts
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await removeAllReleases().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}

import { fileURLToPath } from 'node:url'
import { fetchGithubReleases, getGithubToken, getRepository, githubRequest } from './github-utils'

async function removeAllReleases() {
  const token = getGithubToken()

  const { owner, repo } = getRepository()
  console.log(`Fetching releases for ${owner}/${repo} …`)

  const githubReleases = await fetchGithubReleases(owner, repo, token)

  console.log(`Starting delete of ${githubReleases.length} releases …`)

  for (const release of githubReleases) {
    console.log(`Deleting release ${release.tag_name} (ID: ${release.id}) …`)

    // https://docs.github.com/en/rest/releases/releases#delete-a-release
    await githubRequest(`/repos/${owner}/${repo}/releases/${release.id}`, {
      method: 'DELETE',
      token,
    })
  }

  console.log(`Deleted ${githubReleases.length} releases.`)
}
