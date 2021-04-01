import { getDependers } from './helpers/getDependers'
import { runCommand } from './helpers/runCommand'

installExamples()

async function installExamples() {
  const dependers = getDependers()
  for (const cwd of dependers) {
    process.stdout.write(`Installing dependencies for: ${cwd}...`)
    try {
      await runCommand('npm', ['install', '--legacy-peer-deps'], {
        cwd,
        silent: true
      })
    } catch (err) {
      process.stdout.write(' Failed.\n')
      await runCommand('npm', ['install', '--legacy-peer-deps'], { cwd }) // Not silent; print error
    }
    process.stdout.write(' Done.\n')
  }
}
