export { crawlPlusFiles }

import {
  assertPosixPath,
  assert,
  toPosixPath,
  assertWarning,
  scriptFileExtensionList,
  scriptFileExtensions
} from '../../../../utils.js'
import path from 'path'
import glob from 'fast-glob'
import { exec } from 'child_process'
import { promisify } from 'util'
const execA = promisify(exec)

async function crawlPlusFiles(
  userRootDir: string,
  outDirAbsoluteFilesystem: string,
  isDev: boolean
): Promise<{ filePathRelativeToUserRootDir: string; filePathAbsoluteFilesystem: string }[]> {
  assertPosixPath(userRootDir)
  assertPosixPath(outDirAbsoluteFilesystem)
  // Vike prepends userRootDir without resolving, e.g. outDirRelativeFromUserRootDir can be /home/rom/my-monorepo/my-app/../my-build/dist/ while userRootDir is /home/rom/my-monorepo/my-app/
  assert(outDirAbsoluteFilesystem.startsWith(userRootDir))
  let outDirRelativeFromUserRootDir: string | null = path.posix.relative(userRootDir, outDirAbsoluteFilesystem)
  if (outDirRelativeFromUserRootDir.startsWith('../')) {
    // config.outDir is outside of config.root => it's going to be ignored anyways
    outDirRelativeFromUserRootDir = null
  }
  assert(outDirRelativeFromUserRootDir === null || !outDirRelativeFromUserRootDir.startsWith('.'))

  const timeBase = new Date().getTime()

  let files: string[] = []
  const res = await gitLsFiles(userRootDir, outDirRelativeFromUserRootDir)
  if (
    res &&
    // Fallback to fast-glob for users that dynamically generate plus files (we assume generetad plus files to be skipped because they are usually included in .gitignore)
    res.length > 0
  ) {
    files = res
  } else {
    files = await fastGlob(userRootDir, outDirRelativeFromUserRootDir)
  }

  {
    const time = new Date().getTime() - timeBase
    if (isDev) {
      // We only warn in dev, because while building it's expected to take a long time as fast-glob is competing for resources with other tasks
      assertWarning(
        time < 2 * 1000,
        `Crawling your user files took an unexpected long time (${time}ms). Create a new issue on Vike's GitHub.`,
        {
          onlyOnce: 'slow-page-files-search'
        }
      )
    }
  }

  const plusFiles = files.map((p) => {
    p = toPosixPath(p)
    assert(!p.startsWith(userRootDir))
    const filePathRelativeToUserRootDir = path.posix.join('/', p)
    const filePathAbsoluteFilesystem = path.posix.join(userRootDir, p)
    return {
      filePathRelativeToUserRootDir,
      filePathAbsoluteFilesystem
    }
  })

  return plusFiles
}

// Same as fastGlob() but using `$ git ls-files`
async function gitLsFiles(userRootDir: string, outDirRelativeFromUserRootDir: string | null): Promise<string[] | null> {
  // Test whether Git is installed and whether userRootDir is inside a Git repository
  {
    let stdout: string
    try {
      const res = await execA('git rev-parse --is-inside-work-tree', { cwd: userRootDir })
      stdout = res.stdout
    } catch {
      return null
    }
    assert(stdout.trim() === 'true')
  }

  const cmd = [
    'git ls-files',
    ...scriptFileExtensionList.map((ext) => `"**/+*.${ext}"`),
    ...getIgnorePatterns(outDirRelativeFromUserRootDir).map((pattern) => `--exclude="${pattern}"`),
    // --others lists untracked files only (but using .gitignore because --exclude-standard)
    // --cached adds the tracked files to the output
    '--others --cached --exclude-standard'
  ].join(' ')

  let stdout: string
  try {
    const res = await execA(cmd, { cwd: userRootDir })
    stdout = res.stdout
  } catch (err) {
    if ((err as Error).message.includes('not a git repository')) return null
    throw err
  }

  let files = stdout.split('\n').filter(Boolean)

  files = files.filter(
    // We have to repeat the same exclusion logic here because the `git ls-files` option --exclude only applies to untracked files. (We use --exclude only to speed up the command.)
    (file) => getIgnoreFilter(file, outDirRelativeFromUserRootDir)
  )

  return files
}
// Same as gitLsFiles() but using fast-glob
async function fastGlob(userRootDir: string, outDirRelativeFromUserRootDir: string | null): Promise<string[]> {
  const files = await glob(`**/+*.${scriptFileExtensions}`, {
    ignore: getIgnorePatterns(outDirRelativeFromUserRootDir),
    cwd: userRootDir,
    dot: false
  })
  return files
}

// Same as getIgnoreFilter() but as glob pattern
function getIgnorePatterns(outDirRelativeFromUserRootDir: string | null): string[] {
  const ignorePatterns = [
    '**/node_modules/**',
    // Allow:
    // ```
    // +Page.js
    // +Page.telefunc.js
    // ```
    '**/*.telefunc.*'
  ]
  if (outDirRelativeFromUserRootDir) {
    assert(!outDirRelativeFromUserRootDir.startsWith('/'))
    ignorePatterns.push(`${outDirRelativeFromUserRootDir}/**`)
  }
  return ignorePatterns
}
// Same as getIgnorePatterns() but for Array.filter()
function getIgnoreFilter(file: string, outDirRelativeFromUserRootDir: string | null): boolean {
  assert(!file.startsWith('/'))
  assert(outDirRelativeFromUserRootDir === null || !outDirRelativeFromUserRootDir.startsWith('/'))
  return (
    !file.includes('node_modules/') &&
    !file.includes('.telefunc.') &&
    (!outDirRelativeFromUserRootDir || !file.startsWith(`${outDirRelativeFromUserRootDir}/`))
  )
}
