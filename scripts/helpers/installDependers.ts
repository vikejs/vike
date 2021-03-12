import * as execa from 'execa'
import { readdirSync, lstatSync } from 'fs'
import { resolve as pathResolve } from 'path'
import {
  DIR_BOILERPLATES,
  DIR_EXAMPLES,
  DIR_SRC,
  DIR_ROOT
} from '../helpers/locations'
import { green, bold } from 'kolorist'

export { installDependers }

async function installDependers({
  link,
  cleanSlate
}: {
  link: boolean
  cleanSlate: boolean
}) {
  const dependers = getDependers()
  for (const cwd of dependers) {
    if (cleanSlate) {
      await runCommand('git', ['clean', '-Xdf', cwd + '/'])
    }
    await runCommand('npm', ['install'], { cwd })
    if (link) {
      await linkSrc(cwd)
    }
    const linkState = link ? 'linked' : '*not* linked'
    console.log(
      `Installed deps (${green(bold(linkState))} with \`src/\`): ${cwd}`
    )
  }
}

var yarnBin: string
async function linkSrc(cwd: string) {
  if (!yarnBin) {
    yarnBin = require.resolve(`${DIR_ROOT}/node_modules/.bin/yarn`)
    await runCommand(yarnBin, ['link'], { cwd: DIR_SRC })
  }
  await runCommand(yarnBin, ['link', 'vite-plugin-ssr'], { cwd })
}

function getDependers() {
  return [
    ...retrieveDirectories(DIR_EXAMPLES),
    ...retrieveDirectories(DIR_BOILERPLATES)
  ]
}

function retrieveDirectories(DIR_ROOT: string): string[] {
  const directories = readdirSync(DIR_ROOT)
    .map((file) => pathResolve(`${DIR_ROOT}/${file}`))
    .filter((filePath) => lstatSync(filePath).isDirectory())
    .filter((filePath) => !filePath.includes('node_modules'))
  return directories
}

async function runCommand(
  cmd: string,
  args: string[],
  { cwd }: { cwd?: string } = {}
) {
  await execa(cmd, args, { cwd, stdio: 'inherit' })
}
