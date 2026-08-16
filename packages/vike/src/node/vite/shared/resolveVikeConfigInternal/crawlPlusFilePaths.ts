export { crawlPlusFilePaths }
export { isPlusFile }
export { getPlusFileValueConfigName }

import { assert, assertUsage, assertWarning } from '../../../../utils/assert.js'
import { assertIsNotProductionRuntime } from '../../../../utils/assertSetup.js'
import { createDebug } from '../../../../utils/debug.js'
import { deepEqual } from '../../../../utils/deepEqual.js'
import { getGlobalObject } from '../../../../utils/getGlobalObject.js'
import { hasProp } from '../../../../utils/hasProp.js'
import { assertFilePathAbsoluteFilesystem } from '../../../../utils/isFilePathAbsoluteFilesystem.js'
import { isNotNullish } from '../../../../utils/isNullish.js'
import { scriptFileExtensionPattern, isScriptFile, scriptFileExtensionList } from '../../../../utils/isScriptFile.js'
import { assertPosixPath } from '../../../../utils/path.js'
import { isGitNotUsable, runGitCommand } from '../../../../utils/git.js'
import path from 'node:path'
import { glob } from 'tinyglobby'
import { isTemporaryBuildFile } from './transpileAndExecuteFile.js'
import { getEnvVarObject } from '../getEnvVarObject.js'
import pc from '@brillout/picocolors'
import picomatch, { type Matcher } from 'picomatch'
import { ignorePatternsBuiltIn } from './crawlPlusFilePaths/ignorePatternsBuiltIn.js'
import '../../assertEnvVite.js'
const debug = createDebug('vike:crawl')

assertIsNotProductionRuntime()
const globalObject = getGlobalObject('getVikeConfig/crawlPlusFilePaths.ts', {
  gitIsNotUsable: false,
})

// TODO/after-PR-merge rename crawlPlusFilePaths crawlPlusFiles
async function crawlPlusFilePaths(userRootDir: string): Promise<{ filePathAbsoluteUserRootDir: string }[]> {
  assertPosixPath(userRootDir)
  assertFilePathAbsoluteFilesystem(userRootDir)

  const userSettings = getUserSettings()
  const { ignorePatterns, ignoreMatchers } = getIgnore(userSettings)

  // Crawl
  const filesGit = userSettings.git !== false && (await gitLsFiles(userRootDir, ignorePatterns, ignoreMatchers))
  const filesGitNothingFound = !filesGit || filesGit.length === 0
  const filesGlob = (filesGitNothingFound || debug.isActivated) && (await tinyglobby(userRootDir, ignorePatterns))
  let files = !filesGitNothingFound
    ? filesGit
    : // Fallback to tinyglobby for users that dynamically generate plus files. (Assuming that no plus file is found because of the user's .gitignore list.)
      filesGlob
  assert(files)
  if (debug.isActivated && filesGit && filesGlob) {
    assertWarning(
      deepEqual(filesGlob.slice().sort(), filesGit.slice().sort()),
      "Git and glob results aren't matching.",
      { onlyOnce: false },
    )
  }

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
async function gitLsFiles(userRootDir: string, ignorePatterns: string[], ignoreMatchers: Matcher[]) {
  if (globalObject.gitIsNotUsable) return null

  const args = [
    // Preserve UTF-8 file paths.
    // https://github.com/vikejs/vike/issues/1658
    // https://stackoverflow.com/questions/22827239/how-to-make-git-properly-display-utf-8-encoded-pathnames-in-the-console-window/22828826#22828826
    // https://stackoverflow.com/questions/15884180/how-do-i-override-git-configuration-options-by-command-line-parameters/15884261#15884261
    '-c',
    'core.quotepath=off',

    'ls-files',

    // Performance gain seems negligible: https://github.com/vikejs/vike/pull/1688#issuecomment-2166206648
    ...scriptFileExtensionList.flatMap((ext) => [`**/+*.${ext}`, `+*.${ext}`]),

    // Performance gain is non-negligible.
    //  - https://github.com/vikejs/vike/pull/1688#issuecomment-2166206648
    //  - When node_modules/ is untracked the performance gain could be significant?
    ...ignorePatterns.map((pattern) => `--exclude=${pattern}`),

    // --others --exclude-standard => list untracked files (--others) while using .gitignore (--exclude-standard)
    // --cached => list tracked files
    '--others',
    '--exclude-standard',
    '--cached',
  ]

  // maxBuffer: Infinity — https://github.com/vikejs/vike/issues/1982
  const [resFiles, resFilesDeleted] = await Promise.all([
    // Main command
    runGitCommand(args, userRootDir, { maxBuffer: Infinity }),
    // Get tracked but deleted files
    runGitCommand(['ls-files', '--deleted'], userRootDir, { maxBuffer: Infinity }),
  ])
  const resFailed = [resFiles, resFilesDeleted].find((res) => 'err' in res)
  if (resFailed) {
    assert('err' in resFailed)
    // Minimum Git version for `$ git ls-files`:
    //  - Works with Git 2.43.1 but also (most certainly) with earlier versions.
    //    - We didn't bother test which is the earliest version that works.
    //  - Git 2.32.0 doesn't seem to work: https://github.com/vikejs/vike/discussions/1549
    //    - Maybe it's because of StackBlitz: looking at the release notes, Git 2.32.0 should be working.
    if (await isGitNotUsable(userRootDir, '2.43.1')) {
      globalObject.gitIsNotUsable = true
      return null
    }
    throw resFailed.err
  }
  assert(!('err' in resFiles) && !('err' in resFilesDeleted))
  const filesAll = splitLines(resFiles.stdout)
  const filesDeleted = splitLines(resFilesDeleted.stdout)
  if (debug.isActivated) {
    debug('[git] userRootDir:', userRootDir)
    debug('[git] args:', args)
    debug('[git] result:', filesAll)
    debug('[git] filesDeleted:', filesDeleted)
  }

  const files = []
  for (const filePath of filesAll) {
    // + file?
    if (!path.posix.basename(filePath).startsWith('+')) continue

    // We have to repeat the same exclusion logic here because the option --exclude of `$ git ls-files` only applies to untracked files. (We use --exclude only to speed up the `$ git ls-files` command.)
    if (ignoreMatchers.some((m) => m(filePath))) continue

    // JavaScript file?
    if (!isScriptFile(filePath)) continue

    // Deleted?
    if (filesDeleted.includes(filePath)) continue

    files.push(filePath)
  }

  return files
}
// Same as gitLsFiles() but using tinyglobby
async function tinyglobby(userRootDir: string, ignorePatterns: string[]): Promise<string[]> {
  const pattern = `**/+*.${scriptFileExtensionPattern}`
  const options = {
    ignore: ignorePatterns,
    cwd: userRootDir,
    dot: false,
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

function splitLines(stdout: string): string[] {
  return stdout.split('\n').filter(Boolean)
}

type UserSettings = ReturnType<typeof getUserSettings>
function getUserSettings() {
  const userSettings = getEnvVarObject('VIKE_CRAWL') ?? {}
  const wrongUsage = (settingName: string, settingType: string) =>
    `Setting ${pc.cyan(settingName)} in VIKE_CRAWL should be a ${pc.cyan(settingType)}`
  assertUsage(
    hasProp(userSettings, 'git', 'boolean') || hasProp(userSettings, 'git', 'undefined'),
    wrongUsage('git', 'boolean'),
  )
  assertUsage(
    hasProp(userSettings, 'ignore', 'string[]') ||
      hasProp(userSettings, 'ignore', 'string') ||
      hasProp(userSettings, 'ignore', 'undefined'),
    wrongUsage('git', 'string or an array of strings'),
  )
  assertUsage(
    hasProp(userSettings, 'ignoreBuiltIn', 'boolean') || hasProp(userSettings, 'ignoreBuiltIn', 'undefined'),
    wrongUsage('ignoreBuiltIn', 'boolean'),
  )
  const settingNames = ['git', 'ignore', 'ignoreBuiltIn']
  Object.keys(userSettings).forEach((name) => {
    assertUsage(settingNames.includes(name), `Unknown setting ${pc.bold(pc.red(name))} in VIKE_CRAWL`)
  })
  return userSettings
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

function getIgnore(userSettings: UserSettings) {
  const ignorePatternsSetByUser = [userSettings.ignore].flat().filter(isNotNullish)
  const { ignoreBuiltIn } = userSettings
  const ignorePatterns = [...(ignoreBuiltIn === false ? [] : ignorePatternsBuiltIn), ...ignorePatternsSetByUser]
  const ignoreMatchers = ignorePatterns.map((p) =>
    picomatch(p, {
      // We must pass the same settings than tinyglobby
      // https://github.com/SuperchupuDev/tinyglobby/blob/fcfb08a36c3b4d48d5488c21000c95a956d9797c/src/index.ts#L191-L194
      dot: false,
      nocase: false,
    }),
  )
  return { ignorePatterns, ignoreMatchers }
}
