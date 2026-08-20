export { crawlFiles }

import { assert, assertUsage, assertWarning } from './assert.js'
import { assertIsNotProductionRuntime } from './assertSetup.js'
import { isVersionMatch } from './assertVersion.js'
import { createDebug } from './debug.js'
import { deepEqual } from './deepEqual.js'
import { getGlobalObject } from './getGlobalObject.js'
import { hasProp } from './hasProp.js'
import { isNotNullish } from './isNullish.js'
import path from 'node:path'
import { glob } from 'tinyglobby'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { getEnvVarObject } from './getEnvVarObject.js'
import pc from '@brillout/picocolors'
import picomatch from 'picomatch'
import { ignorePatternsBuiltIn } from './crawlFiles/ignorePatternsBuiltIn.js'
assertIsNotProductionRuntime()
const execA = promisify(exec)
const debug = createDebug('vike:crawl')
const globalObject = getGlobalObject('crawlFiles.ts', {
  gitIsNotUsable: false,
})

type CrawlOptions = {
  filePattern: string
  fileExtension: readonly string[]
  cwd: string
  /**
   * Whether dotfiles and dot directories are crawled (e.g. `.claude/skills/`).
   *
   * Same as tinyglobby's `dot` option.
   */
  dot: boolean
  /**
   * Whether to fallback to tinyglobby if `$ git ls-files` doesn't find any file.
   */
  globFallback: boolean
}

/**
 * Crawl the files matching `filePattern`, using `$ git ls-files` and, as a fallback, [tinyglobby](https://github.com/SuperchupuDev/tinyglobby).
 */
async function crawlFiles(options: CrawlOptions): Promise<string[]> {
  const { filePattern, fileExtension, globFallback } = options
  const userSettings = getUserSettings()

  // One pattern per file extension, see CrawlOptions['fileExtension']
  // (The `filePattern` skips the file extension.)
  assert(!path.posix.basename(filePattern).includes('.'))
  const patterns = fileExtension.map((ext) => `${filePattern}.${ext}`)

  // Crawl
  const filesGit = userSettings.git !== false && (await gitLsFiles(patterns, options, userSettings))
  const useGlob =
    // `!filesGit` => Git isn't usable => we *have* to use tinyglobby
    !filesGit ||
    // `filesGit.length === 0` => fallback to tinyglobby if globFallback
    (filesGit.length === 0 && globFallback)
  const filesGlob = (useGlob || debug.isActivated) && (await tinyglobby(patterns, options, userSettings))
  const files = useGlob ? filesGlob : filesGit
  assert(files)
  if (debug.isActivated && filesGit && filesGlob) {
    assertWarning(
      deepEqual(filesGlob.slice().sort(), filesGit.slice().sort()),
      "Git and glob results aren't matching.",
      { onlyOnce: false },
    )
  }

  return files
}

// Same as tinyglobby() but using `$ git ls-files`
async function gitLsFiles(patterns: string[], options: CrawlOptions, userSettings: UserSettings) {
  if (globalObject.gitIsNotUsable) return null

  const { cwd, dot } = options
  const ignorePatterns = getIgnorePatterns(userSettings)

  // Preserve UTF-8 file paths.
  // https://github.com/vikejs/vike/issues/1658
  // https://stackoverflow.com/questions/22827239/how-to-make-git-properly-display-utf-8-encoded-pathnames-in-the-console-window/22828826#22828826
  // https://stackoverflow.com/questions/15884180/how-do-i-override-git-configuration-options-by-command-line-parameters/15884261#15884261
  const preserveUTF8 = '-c core.quotepath=off'

  // The wildcards of the pathspec also match `/`, thus a leading `**/` doesn't match the root directory: we therefore add a second pathspec for it. (E.g. the pathspec `**/+*.js` doesn't match `+config.js` while `+*.js` does.)
  const globstar = '**/'
  const pathspecs = patterns.flatMap((pattern) => {
    // All our patterns start with `**/`
    assert(pattern.startsWith(globstar))
    const patternRootDir = pattern.slice(globstar.length)
    // A `**/` in the middle of the pattern isn't supported: the pathspec `pages/**/+*.js` doesn't match `pages/+Page.js`.
    assert(!patternRootDir.includes(globstar))
    return [pattern, patternRootDir]
  })

  const cmd = [
    'git',
    preserveUTF8,
    'ls-files',

    // Performance gain seems negligible: https://github.com/vikejs/vike/pull/1688#issuecomment-2166206648
    ...pathspecs.map((pathspec) => `"${pathspec}"`),

    // Performance gain is non-negligible.
    //  - https://github.com/vikejs/vike/pull/1688#issuecomment-2166206648
    //  - When node_modules/ is untracked the performance gain could be significant?
    ...ignorePatterns.map((pattern) => `--exclude="${pattern}"`),

    // --others --exclude-standard => list untracked files (--others) while using .gitignore (--exclude-standard)
    // --cached => list tracked files
    '--others --exclude-standard --cached',
  ].join(' ')

  let filesAll: string[]
  let filesDeleted: string[]
  try {
    ;[filesAll, filesDeleted] = await Promise.all([
      // Main command
      runCmd1(cmd, cwd),
      // Get tracked but deleted files
      runCmd1('git ls-files --deleted', cwd),
    ])
  } catch (err) {
    if (await isGitNotUsable(cwd)) {
      globalObject.gitIsNotUsable = true
      return null
    }
    throw err
  }
  if (debug.isActivated) {
    debug('[git] cwd:', cwd)
    debug('[git] cmd:', cmd)
    debug('[git] result:', filesAll)
    debug('[git] filesDeleted:', filesDeleted)
  }

  const isMatch = picomatch(patterns, {
    // We must pass the same settings than tinyglobby
    // https://github.com/SuperchupuDev/tinyglobby/blob/fcfb08a36c3b4d48d5488c21000c95a956d9797c/src/index.ts#L191-L194
    dot,
    nocase: false,
    ignore: ignorePatterns,
  })

  const files = []
  for (const filePath of filesAll) {
    // Match? (Including the ignore patterns.)
    //  - We have to apply the patterns here as well, because the wildcards of the `$ git ls-files` pathspec also match `/`: e.g. the pathspec `+*.js` matches `pages/+some-dir/some-file.js`.
    //  - We have to apply the ignore patterns here as well, because the option --exclude of `$ git ls-files` only applies to untracked files. (We use --exclude only to speed up the `$ git ls-files` command.)
    if (!isMatch(filePath)) continue

    // Deleted?
    if (filesDeleted.includes(filePath)) continue

    files.push(filePath)
  }

  return files
}
// Same as gitLsFiles() but using tinyglobby
async function tinyglobby(patterns: string[], options: CrawlOptions, userSettings: UserSettings): Promise<string[]> {
  const globOptions = {
    ignore: getIgnorePatterns(userSettings),
    cwd: options.cwd,
    dot: options.dot,
  }
  const files = await glob(patterns, globOptions)
  // Make build deterministic, in order to get a stable generated hash for dist/client/assets/entries/entry-client-routing.${hash}.js
  // https://github.com/vikejs/vike/pull/1750
  files.sort()
  if (debug.isActivated) {
    debug('[glob] patterns:', patterns)
    debug('[glob] options:', globOptions)
    debug('[glob] result:', files)
  }
  return files
}

// Whether Git is installed and whether we can use it
async function isGitNotUsable(cwd: string) {
  // Check Git version
  {
    const res = await runCmd2('git --version', cwd)
    if ('err' in res) return true
    let { stdout, stderr } = res
    assert(stderr === '')
    const prefix = 'git version '
    assert(stdout.startsWith(prefix))
    const gitVersion = stdout.slice(prefix.length)
    //  - Works with Git 2.43.1 but also (most certainly) with earlier versions.
    //    - We didn't bother test which is the earliest version that works.
    //  - Git 2.32.0 doesn't seem to work: https://github.com/vikejs/vike/discussions/1549
    //    - Maybe it's because of StackBlitz: looking at the release notes, Git 2.32.0 should be working.
    if (!isVersionMatch(gitVersion, ['2.43.1'])) return true
  }
  // Is cwd inside a Git repository?
  {
    const res = await runCmd2('git rev-parse --is-inside-work-tree', cwd)
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
    maxBuffer: Infinity,
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

function getIgnorePatterns(userSettings: UserSettings): string[] {
  const ignorePatternsSetByUser = [userSettings.ignore].flat().filter(isNotNullish)
  return [...(userSettings.ignoreBuiltIn === false ? [] : ignorePatternsBuiltIn), ...ignorePatternsSetByUser]
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
    wrongUsage('ignore', 'string or an array of strings'),
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
