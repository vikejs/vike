export { cmd }

import { execSync } from 'child_process'

function cmd(command, { cwd, result }) {
  let stdout = execSync(command, { encoding: 'utf8', cwd, shell: true })
  const words = stdout.split(/\s/).filter(Boolean)
  if (result === 'single') {
    return words[0]
  }
  if (result === 'many') {
    return words
  }
}
