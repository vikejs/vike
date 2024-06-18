export { crawlPlusFiles }

import {
  assertPosixPath,
  assert,
  assertWarning,
  scriptFileExtensions,
  humanizeTime,
  assertIsSingleModuleInstance,
  assertIsNotProductionRuntime,
  isVersionOrAbove,
  isScriptFile
} from '../../../../utils.js'
import path from 'path'
import fs from 'fs/promises'
import glob from 'fast-glob'
import { exec } from 'child_process'
import { promisify } from 'util'
import pc from '@brillout/picocolors'
import { isTemporaryBuildFile } from './transpileAndExecuteFile.js'
const execA = promisify(exec)
const TOO_MANY_UNTRACKED_FILES = 5

assertIsNotProductionRuntime()
assertIsSingleModuleInstance('crawlPlusFiles.ts')
let gitIsNotUsable = false

async function crawlPlusFiles(
  userRootDir: string,
  outDirAbsoluteFilesystem: string,
  isDev: boolean,
  crawlWithGit: null | boolean
): Promise<{ filePathAbsoluteUserRootDir: string }[]> {
  assertPosixPath(userRootDir)
  assertPosixPath(outDirAbsoluteFilesystem)
  let outDirRelativeFromUserRootDir: string | null = path.posix.relative(userRootDir, outDirAbsoluteFilesystem)
  if (outDirRelativeFromUserRootDir.startsWith('../')) {
    // config.outDir is outside of config.root => it's going to be ignored anyways
    outDirRelativeFromUserRootDir = null
  }
  assert(
    outDirRelativeFromUserRootDir === null ||
      /* Not true if outDirRelativeFromUserRootDir starts with a hidden directory (i.e. a directory with a name that starts with `.`)
      !outDirRelativeFromUserRootDir.startsWith('.') &&
      */
      (!outDirRelativeFromUserRootDir.startsWith('./') &&
        //
        !outDirRelativeFromUserRootDir.startsWith('../'))
  )

  const timeBefore = new Date().getTime()

  // Crawl
  let files: string[] = []
  const res = crawlWithGit !== false && (await gitLsFiles(userRootDir, outDirRelativeFromUserRootDir))
  if (
    res &&
    // Fallback to fast-glob for users that dynamically generate plus files. (Assuming that no plus file is found because of the user's .gitignore list.)
    res.files.length > 0
  ) {
    files = res.files
    // We cannot find files inside symlink directories with `$ git ls-files` => we use fast-glob
    files.push(...(await crawlSymlinkDirs(res.symlinkDirs, userRootDir, outDirRelativeFromUserRootDir)))
  } else {
    files = await fastGlob(userRootDir, outDirRelativeFromUserRootDir)
  }

  // Filter build files
  files = files.filter((filePath) => !isTemporaryBuildFile(filePath))

  // Check performance
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

  // Normalize
  const plusFiles = files.map((filePath) => {
    // Both `$ git-ls files` and fast-glob return posix paths
    assertPosixPath(filePath)
    assert(!filePath.startsWith(userRootDir))
    const filePathAbsoluteUserRootDir = path.posix.join('/', filePath)
    return { filePathAbsoluteUserRootDir }
  })

  return plusFiles
}

async function crawlSymlinkDirs(
  symlinkDirs: string[],
  userRootDir: string,
  outDirRelativeFromUserRootDir: string | null
) {
  const filesInSymlinkDirs = (
    await Promise.all(
      symlinkDirs.map(async (symlinkDir) =>
        (
          await fastGlob(path.posix.join(userRootDir, symlinkDir), outDirRelativeFromUserRootDir)
        ).map((filePath) => path.posix.join(symlinkDir, filePath))
      )
    )
  ).flat()
  return filesInSymlinkDirs
}

// Same as fastGlob() but using `$ git ls-files`
async function gitLsFiles(
  userRootDir: string,
  outDirRelativeFromUserRootDir: string | null
): Promise<{
  files: string[]
  symlinkDirs: string[]
} | null> {
  if (gitIsNotUsable) return null

  // Preserve UTF-8 file paths.
  // https://github.com/vikejs/vike/issues/1658
  // https://stackoverflow.com/questions/22827239/how-to-make-git-properly-display-utf-8-encoded-pathnames-in-the-console-window/22828826#22828826
  // https://stackoverflow.com/questions/15884180/how-do-i-override-git-configuration-options-by-command-line-parameters/15884261#15884261
  const preserveUTF8 = '-c core.quotepath=off'

  const ignoreAsPatterns = getIgnoreAsPatterns(outDirRelativeFromUserRootDir)
  const ignoreAsFilterFn = getIgnoreAsFilterFn(outDirRelativeFromUserRootDir)

  const cmd = [
    'git',
    preserveUTF8,
    'ls-files',

    // We don't filter because:
    //  - It would skip symlinks
    //  - Performance gain seems negligible: https://github.com/vikejs/vike/pull/1688#issuecomment-2166206648
    // ...scriptFileExtensionList.map((ext) => `"**/+*.${ext}"`),

    // Performance gain is non-negligible.
    //  - https://github.com/vikejs/vike/pull/1688#issuecomment-2166206648
    //  - When node_modules/ is untracked the performance gain may be significant?
    ...ignoreAsPatterns.map((pattern) => `--exclude="${pattern}"`),

    // --others --exclude-standard => list untracked files (--others) while using .gitignore (--exclude-standard)
    // --cached => list tracked files
    // --stage => get file modes which we use to find symlinks
    '--others --exclude-standard --cached --stage'
  ].join(' ')

  let resultLines: string[]
  let filesDeleted: string[]
  try {
    ;[resultLines, filesDeleted] = await Promise.all([
      // Main command
      runCmd1(cmd, userRootDir),
      // Get tracked but deleted files
      runCmd1('git ls-files --deleted', userRootDir)
    ])
  } catch (err) {
    if (await isGitNotUsable(userRootDir)) {
      gitIsNotUsable = true
      return null
    }
    throw err
  }

  const filePaths = resultLines.map(parseGitLsResultLine)

  // If there are too many files without mode we fallback to fast-glob
  if (filePaths.filter((f) => !f.mode).length > TOO_MANY_UNTRACKED_FILES) return null

  const symlinkDirs: string[] = []
  const files: string[] = []
  for (const { filePath, mode } of filePaths) {
    // Deleted?
    if (filesDeleted.includes(filePath)) continue

    // We have to repeat the same exclusion logic here because the option --exclude of `$ git ls-files` only applies to untracked files. (We use --exclude only to speed up the `$ git ls-files` command.)
    if (!ignoreAsFilterFn(filePath)) continue

    // Symlink directory?
    if (await isSymlinkDirectory(mode, filePath, userRootDir)) {
      symlinkDirs.push(filePath)
      continue
    }

    // + file?
    if (!path.posix.basename(filePath).startsWith('+')) continue
    // JavaScript file?
    if (!isScriptFile(filePath)) continue

    files.push(filePath)
  }

  return { files, symlinkDirs }
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

// Same as getIgnoreAsFilterFn() but as glob pattern
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
// Same as getIgnoreAsPatterns() but for Array.filter()
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

// Parse:
// ```
// some/not/tracked/path
// 100644 f6928073402b241b468b199893ff6f4aed0b7195 0\tpages/index/+Page.tsx
// ```
function parseGitLsResultLine(resultLine: string): { filePath: string; mode: string | null } {
  const [part1, part2, ...rest] = resultLine.split('\t')
  assert(part1)
  assert(rest.length === 0)

  // Git doesn't provide the mode for untracked paths.
  // `resultLine` is:
  // ```
  // some/not/tracked/path
  // ```
  if (part2 === undefined) {
    return { filePath: part1, mode: null }
  }
  assert(part2)

  // `resultLine` is:
  // ```
  // 100644 f6928073402b241b468b199893ff6f4aed0b7195 0\tpages/index/+Page.tsx
  // ```
  const [mode, _, __, ...rest2] = part1.split(' ')
  assert(mode && _ && __ && rest2.length === 0)

  return { filePath: part2, mode }
}

async function isSymlinkDirectory(mode: string | null, filePath: string, userRootDir: string) {
  const filePathAbsolute = path.posix.join(userRootDir, filePath)
  let isSymlink = false
  if (mode === '120000') {
    isSymlink = true
  } else if (mode === null) {
    // `$ git ls-files` doesn't provide the mode when Git doesn't track the path
    const lstats = await fs.lstat(filePathAbsolute)
    isSymlink = lstats.isSymbolicLink()
  } else {
    assert(mode)
  }
  if (!isSymlink) return false
  const stats = await fs.stat(filePathAbsolute)
  const isDirectory = stats.isDirectory()
  return isDirectory
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
