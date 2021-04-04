import { getDependers } from './helpers/getDependers'
import { runCommand } from './helpers/runCommand'
import { DIR_ROOT } from './helpers/locations'
import { relative } from 'path'

unlink()

async function unlink() {
  const dependers = getDependers()
  for (const cwd of dependers) {
    // This removes any symlink
    const version = require(`${cwd}/package.json`).dependencies['vite-plugin-ssr']
    await runCommand('npm', ['install', `vite-plugin-ssr@${version}`, '--no-save'], {
      cwd,
      silent: true
    })
    console.log(`from npm registry: ${relative(DIR_ROOT, cwd)}/node_modules/vite-plugin-ssr`)
  }
}
