export { gitGlob }

import { exec } from 'child_process'
import { promisify } from 'util'

const execA = promisify(exec)

async function gitGlob(userRootDir: string, includePatterns: string[], ignoreDirs: string[] = []) {
  // -o lists untracked files only(but using .gitignore because --exclude-standard)
  // -c adds the tracked files to the output
  // --exclude only applies to untracked files
  const { stdout } = await execA(
    `git ls-files ${includePatterns.join(' ')} -oc --exclude-standard --exclude="**/node_modules/**"`,
    {
      cwd: userRootDir
    }
  )

  return stdout
    .split('\n')
    .filter(
      (line) =>
        line.length &&
        !line.startsWith('node_modules/') &&
        !line.includes('.telefunc.') &&
        !ignoreDirs.some((dir) => line.startsWith(`${dir}/`))
    )
}
