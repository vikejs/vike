import { getDependers } from './helpers/getDependers'
import { runCommand } from './helpers/runCommand'

installExamples()

async function installExamples() {
  const dependers = getDependers()
  for (const cwd of dependers) {
    await runCommand('npm', ['install'], { cwd, silent: true })
    console.log(`Installed dependencies of: ${cwd}`)
  }
}
