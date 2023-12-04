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
  assert(outDirAbsoluteFilesystem.startsWith(userRootDir))
  const outDir = path.posix.relative(userRootDir, outDirAbsoluteFilesystem)
  assert(!outDir.startsWith('.'))

  const timeBase = new Date().getTime()

  let files: string[] = []
  const res = await gitLsFiles(userRootDir, outDir)
  if (
    res &&
    // Fallback to fast-glob for users that dynamically generate plus files (we assume generetad plus files to be skipped because they are usually included in .gitignore)
    res.length > 0
  ) {
    files = res
  } else {
    files = await fastGlob(userRootDir, outDir)
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
async function gitLsFiles(userRootDir: string, outDir: string): Promise<string[] | null> {
  // Test if Git is installed
  {
    let stdout: string
    try {
      const res = await execA('git --version', { cwd: userRootDir })
      stdout = res.stdout
    } catch {
      return null
    }
    assert(stdout.startsWith('git version '))
  }

  const cmd = [
    'git ls-files',
    ...scriptFileExtensionList.map((ext) => `"**/+*.${ext}"`),
    ...getIgnorePatterns(outDir).map((pattern) => `--exclude="${pattern}"`),
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

  assert(!outDir.startsWith('/'))
  files = files.filter(
    // We have to repeat the same exclusion logic here because the `git ls-files` option --exclude only applies to untracked files. (We use --exclude only to speed up the command.)
    (file) => getIgnoreFilter(file, outDir)
  )

  return files
}
// Same as gitLsFiles() but using fast-glob
async function fastGlob(userRootDir: string, outDir: string): Promise<string[]> {
  const files = await glob(`**/+*.${scriptFileExtensions}`, {
    ignore: getIgnorePatterns(outDir),
    cwd: userRootDir,
    dot: false
  })
  return files
}

// Same as getIgnoreFilter() but as glob pattern
function getIgnorePatterns(outDir: string): string[] {
  return [
    '**/node_modules/**',
    `${outDir}/**`,
    // Allow:
    // ```
    // +Page.js
    // +Page.telefunc.js
    // ```
    '**/*.telefunc.*'
  ]
}
// Same as getIgnorePatterns() but for Array.filter()
function getIgnoreFilter(file: string, outDir: string): boolean {
  return !file.includes('node_modules/') && !file.includes('.telefunc.') && !file.startsWith(`${outDir}/`)
}
