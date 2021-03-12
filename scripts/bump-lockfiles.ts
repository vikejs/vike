import { DIR_ROOT } from './helpers/locations'
import * as execa from 'execa'
import { dirname } from 'path'
import assert = require('assert')
import { isAbsolute, join } from 'path'

bumpLockfiles()

async function bumpLockfiles() {
  const lockfiles = await getLockfiles()
  await removeLockfiles(lockfiles)
  await createLockfiles(lockfiles)
  await gitCommit()
}

async function gitCommit() {
  await runCommand('git add .')
  await runCommand__arr('git', [
    'commit',
    '-am',
    'chore: bump package-lock.json'
  ])
}

async function getLockfiles() {
  const files = await runCommand('git ls-files')
  const lockfiles = files
    .split('\n')
    .filter((filePath) => filePath.endsWith('package-lock.json'))
    .map((filePath) => join(DIR_ROOT, filePath))
  return lockfiles
}

async function removeLockfiles(lockfiles: string[]) {
  if (lockfiles.length === 0) return
  await runCommand('git rm ' + lockfiles.join(' '))
  console.log(`[Done] removed package-lock.json files`)
}

async function createLockfiles(lockfiles: string[]) {
  await Promise.all(
    lockfiles.map(async (lockfile) => {
      const cwd = dirname(lockfile)
      await runCommand('git clean -Xdf node_modules', { cwd })
      await runCommand('npm install', { cwd })
      console.log(`[Done] npm install (${cwd})`)
    })
  )
}

async function runCommand(
  cmd: string,
  { cwd = DIR_ROOT }: { cwd?: string } = {}
): Promise<string> {
  assert(isAbsolute(cwd))
  const [command, ...args] = cmd.split(' ')
  const { stdout } = await execa(command, args, { cwd })
  return stdout
}
async function runCommand__arr(command: string, args: string[]) {
  const cwd = DIR_ROOT
  await execa(command, args, { cwd })
}
