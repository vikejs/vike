export { crawlPlusFiles }

import {
  assertPosixPath,
  assert,
  toPosixPath,
  assertWarning,
  scriptFileExtensionList,
  scriptFileExtensions,
  getGlobalObject
} from '../../../../utils.js'
import path from 'path'
import glob from 'fast-glob'
import { exec } from 'child_process'
import { promisify } from 'util'
const execA = promisify(exec)

const globalObject = getGlobalObject('crawlPlusFiles.ts', {
  gitIsMissing: false
})

async function crawlPlusFiles(
  userRootDir: string,
  outDirAbsoluteFilesystem: string,
  isDev: boolean
): Promise<{ filePathRelativeToUserRootDir: string; filePathAbsoluteFilesystem: string }[]> {
  assertPosixPath(userRootDir)
  assertPosixPath(outDirAbsoluteFilesystem)
  let outDirRelativeFromUserRootDir: string | null = path.posix.relative(userRootDir, outDirAbsoluteFilesystem)
  if (outDirRelativeFromUserRootDir.startsWith('../')) {
    // config.outDir is outside of config.root => it's going to be ignored anyways
    outDirRelativeFromUserRootDir = null
  }
  assert(outDirRelativeFromUserRootDir === null || !outDirRelativeFromUserRootDir.startsWith('.'))

  const timeBefore = new Date().getTime()

  let files: string[] = []
  const res = await gitLsFiles(userRootDir, outDirRelativeFromUserRootDir)
  if (
    res &&
    // Fallback to fast-glob for users that dynamically generate plus files. (Assuming all (generetad) plus files to be skipped because users usually included them in `.gitignore`.)
    res.length > 0
  ) {
    files = res
  } else {
    files = await fastGlob(userRootDir, outDirRelativeFromUserRootDir)
  }

  {
    const timeAfter = new Date().getTime()
    const timeSpent = timeAfter - timeBefore
    if (isDev) {
      // We only warn in dev, because while building it's expected to take a long time as crawling is competing for resources with other tasks.
      assertWarning(
        timeSpent < 2 * 1000,
        `Crawling your user files took an unexpected long time (${timeSpent}ms). Create a new issue on Vike's GitHub.`,
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
  if (globalObject.gitIsMissing) return null

  const ignoreAsPatterns = getIgnoreAsPatterns(outDirRelativeFromUserRootDir)
  const ignoreAsFilterFn = getIgnoreAsFilterFn(outDirRelativeFromUserRootDir)

  const cmd = [
    'git ls-files',
    ...scriptFileExtensionList.map((ext) => `"**/+*.${ext}"`),
    ...ignoreAsPatterns.map((pattern) => `--exclude="${pattern}"`),
    // --others lists untracked files only (but using .gitignore because --exclude-standard)
    // --cached adds the tracked files to the output
    '--others --cached --exclude-standard'
  ].join(' ')

  let files: string[]
  let filesDeleted: string[]
  try {
    ;[files, filesDeleted] = await Promise.all([
      // Main command
      runCmd(cmd, userRootDir),
      // Get tracked by deleted files
      runCmd('git ls-files --deleted', userRootDir)
    ])
  } catch (err) {
    if (await isGitMissing(userRootDir)) {
      globalObject.gitIsMissing = true
      return null
    }
    throw err
  }

  files = files
    // We have to repeat the same exclusion logic here because the `git ls-files` option --exclude only applies to untracked files. (We use --exclude only to speed up the command.)
    .filter(ignoreAsFilterFn)
    .filter((file) => !filesDeleted.includes(file))

  return files
}
// Same as gitLsFiles() but using fast-glob
async function fastGlob(userRootDir: string, outDirRelativeFromUserRootDir: string | null): Promise<string[]> {
  const files = await glob(`**/+*.${scriptFileExtensions}`, {
    ignore: getIgnoreAsPatterns(outDirRelativeFromUserRootDir),
    cwd: userRootDir,
    dot: false
  })
  return files
}

// Same as getIgnoreFilter() but as glob pattern
function getIgnoreAsPatterns(outDirRelativeFromUserRootDir: string | null): string[] {
  const ignoreAsPatterns = [
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
    ignoreAsPatterns.push(`${outDirRelativeFromUserRootDir}/**`)
  }
  return ignoreAsPatterns
}
// Same as getIgnorePatterns() but for Array.filter()
function getIgnoreAsFilterFn(outDirRelativeFromUserRootDir: string | null): (file: string) => boolean {
  assert(outDirRelativeFromUserRootDir === null || !outDirRelativeFromUserRootDir.startsWith('/'))
  return (file: string) =>
    !file.includes('node_modules/') &&
    !file.includes('.telefunc.') &&
    (outDirRelativeFromUserRootDir === null || !file.startsWith(`${outDirRelativeFromUserRootDir}/`))
}

// Whether Git is installed and whether userRootDir is inside a Git repository
async function isGitMissing(userRootDir: string) {
  let res: Awaited<ReturnType<typeof execA>>
  try {
    res = await execA('git rev-parse --is-inside-work-tree', { cwd: userRootDir })
  } catch {
    return true
  }
  const { stdout, stderr } = res
  assert(stderr.toString().trim() === '')
  assert(stdout.toString().trim() === 'true')
  return false
}

async function runCmd(cmd: string, cwd: string): Promise<string[]> {
  const res = await execA(cmd, { cwd })
  assert(res.stderr === '')
  return res.stdout.toString().split('\n').filter(Boolean)
}
