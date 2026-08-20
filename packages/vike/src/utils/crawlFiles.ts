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
  /** The directory that is crawled. */
  cwd: string
  /** The file extensions that are crawled, e.g. `['js', 'ts']` — the `filePattern` skips the file extension then.
   *
   * (We use a list instead of a brace expansion `{js,ts}`, because the pathspec of `$ git ls-files` doesn't support brace expansion.)
   */
  fileExtensions?: readonly string[]
  /** Whether dotfiles and dot directories are crawled (e.g. `.claude/skills/`).
   *
   * Same as tinyglobby's `dot` option.
   *
   * @default false
   */
  dot?: boolean
  /** Whether to fallback to tinyglobby if `$ git ls-files` doesn't find any file.
   *
   * Set it to `true` for files that are expected to exist: if Git doesn't find any of them then it's likely because of the user's `.gitignore` list (e.g. the user dynamically generates the files).
   *
   * @default false
   */
  globFallback?: boolean
}
type Crawl = ReturnType<typeof getCrawl>

/** Crawl the files matching `filePattern`, using `$ git ls-files` and, as a fallback, [tinyglobby](https://github.com/SuperchupuDev/tinyglobby).
 *
 * The `filePattern` is a tinyglobby pattern — it's applied to the results of `$ git ls-files` as well, so that both crawling methods return the same files.
 *
 * The returned file paths are POSIX paths relative to `options.cwd`.
 */
async function crawlFiles(filePattern: string, options: CrawlOptions): Promise<string[]> {
  const crawl = getCrawl(filePattern, options)

  // Crawl
  const filesGit = crawl.git && (await gitLsFiles(crawl))
  const useGlob =
    // Git isn't usable
    !filesGit ||
    // Fallback to tinyglobby, see CrawlOptions['globFallback']
    (filesGit.length === 0 && crawl.globFallback)
  const filesGlob = (useGlob || debug.isActivated) && (await tinyglobby(crawl))
  const files = !useGlob ? filesGit : filesGlob
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

function getCrawl(filePattern: string, options: CrawlOptions) {
  const userSettings = getUserSettings()
  const dot = options.dot ?? false
  const patterns = getPatterns(filePattern, options.fileExtensions)
  const ignorePatternsSetByUser = [userSettings.ignore].flat().filter(isNotNullish)
  const ignorePatterns: string[] = [
    ...(userSettings.ignoreBuiltIn === false ? [] : ignorePatternsBuiltIn),
    ...ignorePatternsSetByUser,
  ]
  return {
    patterns,
    gitPathspecs: patterns.flatMap((pattern) => getGitPathspecs(pattern)),
    cwd: options.cwd,
    dot,
    ignorePatterns,
    isMatch: picomatch(patterns, {
      // We must pass the same settings than tinyglobby
      // https://github.com/SuperchupuDev/tinyglobby/blob/fcfb08a36c3b4d48d5488c21000c95a956d9797c/src/index.ts#L191-L194
      dot,
      nocase: false,
      ignore: ignorePatterns,
    }),
    git: userSettings.git !== false,
    globFallback: options.globFallback ?? false,
  }
}

// One pattern per file extension, see CrawlOptions['fileExtensions']
function getPatterns(filePattern: string, fileExtensions: undefined | readonly string[]): string[] {
  if (!fileExtensions) return [filePattern]
  assert(!path.posix.basename(filePattern).includes('.'), { filePattern })
  return fileExtensions.map((fileExtension) => `${filePattern}.${fileExtension}`)
}

// Same as tinyglobby() but using `$ git ls-files`
async function gitLsFiles(crawl: Crawl) {
  if (globalObject.gitIsNotUsable) return null

  // Preserve UTF-8 file paths.
  // https://github.com/vikejs/vike/issues/1658
  // https://stackoverflow.com/questions/22827239/how-to-make-git-properly-display-utf-8-encoded-pathnames-in-the-console-window/22828826#22828826
  // https://stackoverflow.com/questions/15884180/how-do-i-override-git-configuration-options-by-command-line-parameters/15884261#15884261
  const preserveUTF8 = '-c core.quotepath=off'

  const cmd = [
    'git',
    preserveUTF8,
    'ls-files',

    // Performance gain seems negligible: https://github.com/vikejs/vike/pull/1688#issuecomment-2166206648
    ...crawl.gitPathspecs.map((pathspec) => `"${pathspec}"`),

    // Performance gain is non-negligible.
    //  - https://github.com/vikejs/vike/pull/1688#issuecomment-2166206648
    //  - When node_modules/ is untracked the performance gain could be significant?
    ...crawl.ignorePatterns.map((pattern) => `--exclude="${pattern}"`),

    // --others --exclude-standard => list untracked files (--others) while using .gitignore (--exclude-standard)
    // --cached => list tracked files
    '--others --exclude-standard --cached',
  ].join(' ')

  let filesAll: string[]
  let filesDeleted: string[]
  try {
    ;[filesAll, filesDeleted] = await Promise.all([
      // Main command
      runCmd1(cmd, crawl.cwd),
      // Get tracked but deleted files
      runCmd1('git ls-files --deleted', crawl.cwd),
    ])
  } catch (err) {
    if (await isGitNotUsable(crawl.cwd)) {
      globalObject.gitIsNotUsable = true
      return null
    }
    throw err
  }
  if (debug.isActivated) {
    debug('[git] cwd:', crawl.cwd)
    debug('[git] cmd:', cmd)
    debug('[git] result:', filesAll)
    debug('[git] filesDeleted:', filesDeleted)
  }

  const files = []
  for (const filePath of filesAll) {
    // Match? (Including the ignore patterns.)
    //  - We have to apply the patterns here as well, because the wildcards of the `$ git ls-files` pathspec also match `/`: e.g. the pathspec `+*.js` matches `pages/+some-dir/some-file.js`.
    //  - We have to apply the ignore patterns here as well, because the option --exclude of `$ git ls-files` only applies to untracked files. (We use --exclude only to speed up the `$ git ls-files` command.)
    if (!crawl.isMatch(filePath)) continue

    // Deleted?
    if (filesDeleted.includes(filePath)) continue

    files.push(filePath)
  }

  return files
}
// Same as gitLsFiles() but using tinyglobby
async function tinyglobby(crawl: Crawl): Promise<string[]> {
  const options = {
    ignore: crawl.ignorePatterns,
    cwd: crawl.cwd,
    dot: crawl.dot,
  }
  const files = await glob(crawl.patterns, options)
  // Make build deterministic, in order to get a stable generated hash for dist/client/assets/entries/entry-client-routing.${hash}.js
  // https://github.com/vikejs/vike/pull/1750
  files.sort()
  if (debug.isActivated) {
    debug('[glob] patterns:', crawl.patterns)
    debug('[glob] options:', options)
    debug('[glob] result:', files)
  }
  return files
}

// The wildcards of the `$ git ls-files` pathspec also match `/`, thus a leading `**/` doesn't match the root directory: we therefore add a second pathspec for it. (E.g. the pathspec `**/+*.js` doesn't match `+config.js` while `+*.js` does.)
function getGitPathspecs(pattern: string): string[] {
  const globstar = '**/'
  // All our patterns start with `**/`
  assert(pattern.startsWith(globstar), { pattern })
  const patternRootDir = pattern.slice(globstar.length)
  // A `**/` in the middle of the pattern isn't supported: the pathspec `pages/**/+*.js` doesn't match `pages/+Page.js`.
  assert(!patternRootDir.includes(globstar), { pattern })
  return [pattern, patternRootDir]
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
