export { crawlPlusFiles }
export { isPlusFile }
export { getPlusFileValueConfigName }

import {
  assertPosixPath,
  assert,
  scriptFileExtensions,
  assertIsSingleModuleInstance,
  assertIsNotProductionRuntime,
  isVersionOrAbove,
  isScriptFile,
  scriptFileExtensionList,
  createDebugger,
  deepEqual,
  assertUsage
} from '../../../../utils.js'
import path from 'path'
import { glob } from 'tinyglobby'
import { exec } from 'child_process'
import { promisify } from 'util'
import { isTemporaryBuildFile } from './transpileAndExecuteFile.js'
import { getEnvVarObject } from '../../../../shared/getEnvVarObject.js'
const execA = promisify(exec)

const debug = createDebugger('vike:crawl')

assertIsNotProductionRuntime()
assertIsSingleModuleInstance('getVikeConfig/crawlPlusFiles.ts')
let gitIsNotUsable = false

async function crawlPlusFiles(
  userRootDir: string,
  outDirAbsoluteFilesystem: null | string
): Promise<{ filePathAbsoluteUserRootDir: string }[]> {
  assertPosixPath(userRootDir)

  //*/
  const outDirRelativeFromUserRootDir = null as string | null
  /*/
  assertPosixPath(outDirAbsoluteFilesystem)
  let outDirRelativeFromUserRootDir: string | null = path.posix.relative(userRootDir, outDirAbsoluteFilesystem)
  if (outDirRelativeFromUserRootDir.startsWith('../')) {
    // config.outDir is outside of config.root => it's going to be ignored anyways
    outDirRelativeFromUserRootDir = null
  }
  //*/
  assert(
    outDirRelativeFromUserRootDir === null ||
      /* Not true if outDirRelativeFromUserRootDir starts with a hidden directory (i.e. a directory with a name that starts with `.`)
      !outDirRelativeFromUserRootDir.startsWith('.') &&
      */
      (!outDirRelativeFromUserRootDir.startsWith('./') &&
        //
        !outDirRelativeFromUserRootDir.startsWith('../'))
  )

  // Crawl
  const filesGit = !isGitCrawlDisabled() && (await gitLsFiles(userRootDir, outDirRelativeFromUserRootDir))
  const filesGitNothingFound = !filesGit || filesGit.length === 0
  const filesGlob =
    (filesGitNothingFound || debug.isActivated) && (await tinyglobby(userRootDir, outDirRelativeFromUserRootDir))
  let files = !filesGitNothingFound
    ? filesGit
    : // Fallback to tinyglobby for users that dynamically generate plus files. (Assuming that no plus file is found because of the user's .gitignore list.)
      filesGlob
  assert(files)
  if (debug.isActivated) assert(deepEqual(filesGlob, filesGit), "Git and glob results aren't matching.")

  // Filter build files
  files = files.filter((filePath) => !isTemporaryBuildFile(filePath))

  // Normalize
  const plusFiles = files.map((filePath) => {
    // Both `$ git-ls files` and tinyglobby return posix paths
    assertPosixPath(filePath)
    assert(!filePath.startsWith(userRootDir))
    const filePathAbsoluteUserRootDir = path.posix.join('/', filePath)
    assert(isPlusFile(filePathAbsoluteUserRootDir))
    return { filePathAbsoluteUserRootDir }
  })

  return plusFiles
}

// Same as tinyglobby() but using `$ git ls-files`
async function gitLsFiles(userRootDir: string, outDirRelativeFromUserRootDir: string | null) {
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

    // Performance gain seems negligible: https://github.com/vikejs/vike/pull/1688#issuecomment-2166206648
    ...scriptFileExtensionList.map((ext) => `"**/+*.${ext}" "+*.${ext}"`),

    // Performance gain is non-negligible.
    //  - https://github.com/vikejs/vike/pull/1688#issuecomment-2166206648
    //  - When node_modules/ is untracked the performance gain could be significant?
    ...ignoreAsPatterns.map((pattern) => `--exclude="${pattern}"`),

    // --others --exclude-standard => list untracked files (--others) while using .gitignore (--exclude-standard)
    // --cached => list tracked files
    '--others --exclude-standard --cached'
  ].join(' ')

  let filesAll: string[]
  let filesDeleted: string[]
  try {
    ;[filesAll, filesDeleted] = await Promise.all([
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
  if (debug.isActivated) {
    debug('[git] userRootDir:', userRootDir)
    debug('[git] cmd:', cmd)
    debug('[git] result:', filesAll)
    debug('[git] filesDeleted:', filesDeleted)
  }

  const files = []
  for (const filePath of filesAll) {
    // + file?
    if (!path.posix.basename(filePath).startsWith('+')) continue

    // We have to repeat the same exclusion logic here because the option --exclude of `$ git ls-files` only applies to untracked files. (We use --exclude only to speed up the `$ git ls-files` command.)
    if (!ignoreAsFilterFn(filePath)) continue

    // JavaScript file?
    if (!isScriptFile(filePath)) continue

    // Deleted?
    if (filesDeleted.includes(filePath)) continue

    files.push(filePath)
  }

  return files
}
// Same as gitLsFiles() but using tinyglobby
async function tinyglobby(userRootDir: string, outDirRelativeFromUserRootDir: string | null): Promise<string[]> {
  const pattern = `**/+*.${scriptFileExtensions}`
  const options = {
    ignore: getIgnoreAsPatterns(outDirRelativeFromUserRootDir),
    cwd: userRootDir,
    dot: false,
    expandDirectories: false
  }
  const files = await glob(pattern, options)
  // Make build deterministic, in order to get a stable generated hash for dist/client/assets/entries/entry-client-routing.${hash}.js
  // https://github.com/vikejs/vike/pull/1750
  files.sort()
  if (debug.isActivated) {
    debug('[glob] pattern:', pattern)
    debug('[glob] options:', options)
    debug('[glob] result:', files)
  }
  return files
}

// Same as getIgnoreAsFilterFn() but as glob pattern
function getIgnoreAsPatterns(outDirRelativeFromUserRootDir: string | null): string[] {
  const ignoreAsPatterns = [
    '**/node_modules/**',
    '**/ejected/**',
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
    !file.includes('ejected/') &&
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
  const { stdout } = await execA(cmd, {
    cwd,
    // https://github.com/vikejs/vike/issues/1982
    maxBuffer: Infinity
  })
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

function isGitCrawlDisabled() {
  const crawSettings = getEnvVarObject('VIKE_CRAWL')
  return crawSettings?.git === false
}

function isPlusFile(filePath: string): boolean {
  assertPosixPath(filePath)
  if (isTemporaryBuildFile(filePath)) return false
  const fileName = filePath.split('/').pop()!
  return fileName.startsWith('+')
}

function getPlusFileValueConfigName(filePath: string): string | null {
  if (!isPlusFile(filePath)) return null
  const fileName = path.posix.basename(filePath)
  // assertNoUnexpectedPlusSign(filePath, fileName)
  const basename = fileName.split('.')[0]!
  assert(basename.startsWith('+'))
  const configName = basename.slice(1)
  assertUsage(configName !== '', `${filePath} Invalid filename ${fileName}`)
  return configName
}
/* https://github.com/vikejs/vike/issues/1407
function assertNoUnexpectedPlusSign(filePath: string, fileName: string) {
  const dirs = path.posix.dirname(filePath).split('/')
  dirs.forEach((dir, i) => {
    const dirPath = dirs.slice(0, i + 1).join('/')
    assertUsage(
      !dir.includes('+'),
      `Character '+' is a reserved character: remove '+' from the directory name ${dirPath}/`
    )
  })
  assertUsage(
    !fileName.slice(1).includes('+'),
    `Character '+' is only allowed at the beginning of filenames: make sure ${filePath} doesn't contain any '+' in its filename other than its first letter`
  )
}
*/
