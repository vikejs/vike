import { readdirSync, lstatSync } from 'fs'
import { resolve as pathResolve } from 'path'
import { DIR_BOILERPLATES, DIR_EXAMPLES } from '../helpers/locations'

export { getDependers }

function getDependers() {
  return [...retrieveDirectories(DIR_EXAMPLES), ...retrieveDirectories(DIR_BOILERPLATES)]
}

function retrieveDirectories(DIR_ROOT: string): string[] {
  const directories = readdirSync(DIR_ROOT)
    .map((file) => pathResolve(`${DIR_ROOT}/${file}`))
    .filter((filePath) => lstatSync(filePath).isDirectory())
    .filter((filePath) => !filePath.includes('node_modules'))
  return directories
}
