export { crawlPlusFiles }

import {
  assertPosixPath,
  assert,
  toPosixPath,
  assertWarning,
  scriptFileExtensionList,
  scriptFileExtensions,
  humanizeTime,
  assertIsSingleModuleInstance,
  assertIsNotProductionRuntime,
  isVersionOrAbove
} from '../../../../utils.js'
import path from 'path'
import glob from 'fast-glob'
import { exec } from 'child_process'
import { promisify } from 'util'
import pc from '@brillout/picocolors'
import { isTemporaryBuildFile } from './transpileAndExecuteFile.js'
const execA = promisify(exec)

assertIsNotProductionRuntime()
assertIsSingleModuleInstance('crawlPlusFiles.ts')
let gitIsNotUsable = false

async function crawlPlusFiles(
  userRootDir: string,
  outDirAbsoluteFilesystem: string,
  isDev: boolean
): Promise<{ filePathAbsoluteUserRootDir: string }[]> {
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

  files = files.filter((file) => !isTemporaryBuildFile(file))

  {
    const timeAfter = new Date().getTime()
    const timeSpent = timeAfter - timeBefore
    if (isDev) {
      // We only warn in dev, because while building it's expected to take a long time as crawling is competing for resources with other tasks.
      // Although, in dev, it's also competing for resources e.g. with Vite's `optimizeDeps`.
      assertWarning(
        timeSpent < 3 * 1000,
        `Crawling your ${pc.cyan('+')} files took an unexpected long time (${humanizeTime(
          timeSpent
        )}). If you repeatedly get this warning, then consider creating a new issue on Vike's GitHub.`,
        {
          onlyOnce: 'slow-page-files-search'
        }
      )
    }
  }

  const plusFiles = files.map((p) => {
    p = toPosixPath(p)
    assert(!p.startsWith(userRootDir))
    const filePathAbsoluteUserRootDir = path.posix.join('/', p)
    return { filePathAbsoluteUserRootDir }
  })

  return plusFiles
}

// Same as fastGlob() but using `$ git ls-files`
async function gitLsFiles(userRootDir: string, outDirRelativeFromUserRootDir: string | null): Promise<string[] | null> {
  if (gitIsNotUsable) return null

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
      runCmd1(cmd, userRootDir),
      // Get tracked by deleted files
      runCmd1('git ls-files --deleted', userRootDir)
    ])
  } catch (err) {
    if (await isGitNotUsable(userRootDir)) {
      gitIsNotUsable = true
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

// Whether Git is installed and whether we can use it
async function isGitNotUsable(userRootDir: string) {
  // Check Git version
  {
    const res = await runCmd2('git --version', userRootDir)
    if ('err' in res) return true
    let { stdout, stderr } = res
    assert(stderr === '')
    const prefix = 'git version '
    assert(stdout.startsWith(prefix))
    const gitVersion = stdout.slice(prefix.length)
    //  - Works with Git 2.43.1 but also (most certainly) with earlier versions.
    //    - We didn't bother test which is the earliest verision that works.
    //  - Git 2.32.0 doesn't seem to work: https://github.com/vikejs/vike/discussions/1549
    //    - Maybe it's because of StackBlitz: looking at the release notes, Git 2.32.0 should be working.
    if (!isVersionOrAbove(gitVersion, '2.43.1')) return true
  }
  // Is userRootDir inside a Git repository?
  {
    const res = await runCmd2('git rev-parse --is-inside-work-tree', userRootDir)
    if ('err' in res) return true
    let { stdout, stderr } = res
    assert(stderr === '')
    assert(stdout === 'true')
    return false
  }
}

async function runCmd1(cmd: string, cwd: string): Promise<string[]> {
  const { stdout } = await execA(cmd, { cwd })
  /* Not always true: https://github.com/vikejs/vike/issues/1440#issuecomment-1892831303
  assert(res.stderr === '')
  */
  return stdout.toString().split('\n').filter(Boolean)
}
async function runCmd2(cmd: string, cwd: string): Promise<{ err: unknown } | { stdout: string; stderr: string }> {
  let res: Awaited<ReturnType<typeof execA>>
  try {
    res = await execA(cmd, { cwd })
  } catch (err) {
    return { err }
  }
  let { stdout, stderr } = res
  stdout = stdout.toString().trim()
  stderr = stderr.toString().trim()
  return { stdout, stderr }
}
