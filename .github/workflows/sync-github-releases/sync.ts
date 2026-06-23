// Synchronize CHANGELOG.md -> GitHub Releases.

main()

import { createSyncContext, syncPackage } from './sync/sync-package.ts'
import { getRepoRoot, getTrackedChangelogFiles, toPackageDirs } from './utils/git.ts'
import { createReleasesClientFromEnv, getDefaultBranch, getPushedFiles } from './utils/github-env.ts'

async function main(): Promise<void> {
  // The package.json scripts run from this folder; switch to the repo root so the git commands and
  // package-dir paths below resolve against it.
  process.chdir(getRepoRoot())

  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const explicitPackageDirs = args.filter((arg) => !arg.startsWith('--'))

  // Every package tracked in the repo — one per CHANGELOG.md. Used both as the default set to sync and
  // to pick the tag scheme: when several packages share the repo they also share its tag namespace, so
  // their release tags are qualified with the package name (see getTagScheme()).
  const allPackageDirs = toPackageDirs(getTrackedChangelogFiles())
  const packageDirs = getPackageDirsToSync(explicitPackageDirs, allPackageDirs)
  if (packageDirs.length === 0) {
    console.log('No CHANGELOG.md changes detected — nothing to sync.')
    return
  }

  const { client, owner, repo } = createReleasesClientFromEnv()
  const context = createSyncContext({
    client,
    owner,
    repo,
    defaultBranch: getDefaultBranch(),
    hasMultiplePackages: allPackageDirs.length > 1,
    dryRun,
  })

  for (const packageDir of packageDirs) {
    console.log(`Syncing GitHub releases for package directory: ${packageDir}`)
    await syncPackage(packageDir, context)
  }
}

function getPackageDirsToSync(explicitPackageDirs: string[], allPackageDirs: string[]): string[] {
  if (explicitPackageDirs.length > 0) return explicitPackageDirs
  const pushedFiles = getPushedFiles()
  if (pushedFiles) return toPackageDirs(pushedFiles)
  return allPackageDirs
}
