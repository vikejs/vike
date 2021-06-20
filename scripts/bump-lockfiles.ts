import { DIR_ROOT } from './helpers/locations'
import * as execa from 'execa'
import { dirname } from 'path'
import assert = require('assert')
import { isAbsolute, join } from 'path'
import { hasTest } from './helpers/hasTest'

bumpLockfiles()

async function bumpLockfiles() {
  const lockfiles = await getLockfiles()
  await removeLockfiles(lockfiles)
  await createLockfiles(lockfiles)
}

async function getLockfiles() {
  const files = await runCommand('git ls-files')
  const lockfiles = files
    .split('\n')
    .filter((filePath) => filePath.endsWith('package-lock.json'))
    .map((filePath) => join(DIR_ROOT, filePath))
    .filter((filePath) => hasTest(dirname(filePath)))
  return lockfiles
}

async function removeLockfiles(lockfiles: string[]) {
  if (lockfiles.length === 0) return
  await runCommand('git rm -f ' + lockfiles.join(' '))
  console.log(`[Done] removed package-lock.json files`)
}

async function createLockfiles(lockfiles: string[]) {
  for (const lockfile of lockfiles) {
    const cwd = dirname(lockfile)
    process.stdout.write(`Installing dependencies for: ${cwd}...`)
    await runCommand('git clean -Xdf node_modules', { cwd })
    await runCommand('npm install', { cwd })
    process.stdout.write(' Done.\n')
  }
  // Running `npm install` twice to fix `npm install` not being idempotent
  await runCommand('npm install', { cwd: DIR_ROOT })
}

async function runCommand(cmd: string, { cwd = DIR_ROOT }: { cwd?: string } = {}): Promise<string> {
  assert(isAbsolute(cwd))
  const [command, ...args] = cmd.split(' ')
  const { stdout } = await execa(command, args, { cwd })
  return stdout
}
