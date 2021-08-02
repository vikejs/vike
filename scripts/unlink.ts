import { getDependers } from './helpers/getDependers'
import { runCommand } from './helpers/runCommand'
import { DIR_ROOT } from './helpers/locations'
import { relative } from 'path'

export { unlink }

async function unlink(pkg: 'vite-plugin-ssr' | 'vite') {
  const dependers = getDependers()
  for (const cwd of dependers) {
    // This removes any symlink
    const version = require(`${cwd}/package.json`).dependencies[pkg]
    await runCommand('npm', ['install', `${pkg}@${version}`, '--no-save'], {
      cwd,
      silent: true
    })
    console.log(`from npm registry: ${relative(DIR_ROOT, cwd)}/node_modules/${pkg}`)
  }
}
