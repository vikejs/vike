import * as execa from 'execa'
import { join, dirname } from 'path'
import { hasTest } from './helpers/hasTest'
import { DIR_ROOT } from './helpers/locations'
const ncuBin = require.resolve(`${DIR_ROOT}/node_modules/.bin/ncu`) // `ncu` is bin of npm package `npm-check-updates`

updateDependencies()

async function updateDependencies() {
  for (const packageJson of await getAllPackageJson()) {
    const cwd = dirname(packageJson)
    if (!hasTest(cwd)) continue
    await run__follow(
      `${ncuBin} -u --dep dev,prod --reject vue --reject @vue/server-renderer --reject @vue/compiler-sfc --reject jest --reject ts-node`,
      { cwd }
    )
    // await run__follow(`${ncuBin} -u --dep dev,prod vue @vue/server-renderer @vue/compiler-sfc --target greatest`, { cwd })
  }
}

async function getAllPackageJson() {
  const cwd = DIR_ROOT
  const files = (await run__return('git ls-files', { cwd })).split('\n')
  return files.filter((path) => path.endsWith('package.json')).map((path) => join(cwd, path))
}

async function run__follow(cmd: string, { cwd }): Promise<void> {
  const [command, ...args] = cmd.split(' ')
  await execa(command, args, { cwd, stdio: 'inherit' })
}
async function run__return(cmd: string, { cwd }): Promise<string> {
  const [command, ...args] = cmd.split(' ')
  const { stdout } = await execa(command, args, { cwd })
  return stdout
}
