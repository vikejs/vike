export { runGitCommand }
export { isGitNotUsable }

import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { assert } from './assert.js'
import { assertIsNotBrowser } from './assertIsNotBrowser.js'
import { assertIsNotProductionRuntime } from './assertSetup.js'
import { isVersionMatch, type Version } from './assertVersion.js'
import { createDebug } from './debug.js'
const execFileA = promisify(execFile)
const debug = createDebug('vike:git')

assertIsNotBrowser()
assertIsNotProductionRuntime()

// Run a Git command — doesn't throw: it returns `{ err }` upon failure.
async function runGitCommand(
  args: string[],
  cwd: string,
  { maxBuffer }: { maxBuffer?: number } = {},
): Promise<{ err: unknown } | { stdout: string; stderr: string }> {
  let res: Awaited<ReturnType<typeof execFileA>>
  try {
    res = await execFileA('git', args, { cwd, maxBuffer })
  } catch (err) {
    debug(`$ git ${args.join(' ')} — failed:`, err)
    return { err }
  }
  const stdout = res.stdout.toString()
  const stderr = res.stderr.toString()
  return { stdout, stderr }
}

// Whether Git is installed and whether we can use it
async function isGitNotUsable(cwd: string, minimumVersion?: Version): Promise<boolean> {
  // Check Git version
  {
    const res = await runGitCommand(['--version'], cwd)
    if ('err' in res) return true
    const stdout = res.stdout.trim()
    const stderr = res.stderr.trim()
    assert(stderr === '')
    const prefix = 'git version '
    assert(stdout.startsWith(prefix))
    const gitVersion = stdout.slice(prefix.length)
    if (minimumVersion && !isVersionMatch(gitVersion, [minimumVersion])) return true
  }
  // Is cwd inside a Git repository?
  {
    const res = await runGitCommand(['rev-parse', '--is-inside-work-tree'], cwd)
    if ('err' in res) return true
    const stdout = res.stdout.trim()
    const stderr = res.stderr.trim()
    assert(stderr === '')
    assert(stdout === 'true')
    return false
  }
}
