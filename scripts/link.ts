import * as execa from 'execa'
import { readdirSync, lstatSync } from 'fs'
import { resolve as pathResolve } from 'path'
import { DIR_BOILERPLATES, DIR_EXAMPLES, DIR_SRC, rootDir } from './_locations'
import { green, bold } from 'kolorist'

const yarnBin = require.resolve(`${rootDir}/node_modules/.bin/yarn`)
const stdio = 'inherit'

link()

async function link() {
  await execa(yarnBin, ['link'], { cwd: DIR_SRC, stdio })
  const directories = getDirectories()
  for (const cwd of directories) {
    await execa('npm', ['install'], { cwd, stdio })
    await execa(yarnBin, ['link', 'vite-plugin-ssr'], { cwd, stdio })
    console.log(green(bold(`Ready for dev: ${cwd}`)))
  }
}

function getDirectories() {
  return [
    ...retrieveDirectories(DIR_EXAMPLES),
    ...retrieveDirectories(DIR_BOILERPLATES)
  ]
}

function retrieveDirectories(rootDir: string): string[] {
  const directories = readdirSync(rootDir)
    .map((file) => pathResolve(`${rootDir}/${file}`))
    .filter((filePath) => lstatSync(filePath).isDirectory())
  return directories
}
