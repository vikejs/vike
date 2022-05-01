export { cmd }

import { execSync } from 'child_process'

/** @type { (command: string, options?: { cwd?: string }) => string } */
function cmd(command, { cwd } = {}) {
  let stdout = execSync(command, { encoding: 'utf8', cwd })
  stdout = stdout.split(/\s/).filter(Boolean).join(' ')
  return stdout
}
