import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const mapping = {
  '.page.server.mdx': '/+Page.mdx',
  '.page.route.ts': '/+route.ts'
}

main()

function main() {
  console.log('Migrated:')

  const todoManually = []
  getFiles().forEach((file) => {
    for (const [suffixOld, suffixNew] of Object.entries(mapping)) {
      if (file.endsWith(suffixOld)) {
        const fileMoved = file.replace(suffixOld, suffixNew)
        const fileAbs = addCwd(file)
        const fileMovedAbs = addCwd(fileMoved)
        console.log('-', file)
        console.log('+', fileMoved)
        fs.mkdirSync(path.dirname(fileMovedAbs), { recursive: true })
        fs.renameSync(fileAbs, fileMovedAbs)
        return
      }
    }

    if (file.includes('.page.')) {
      todoManually.push(file)
    }
  })
  if (todoManually.length) {
    console.log(
      [
        // prettier-ignore
        '',
        'To-Do migrate manually:',
        ...todoManually.map((f) => `  ${f}`)
      ].join('\n')
    )
  }
}

function getFiles() {
  try {
    const stdout = execSync('git ls-files', { encoding: 'utf-8' })
    const files = stdout.split('\n').filter(Boolean)
    return files
  } catch (error) {
    console.error(`Error executing git ls-files: ${error}`)
    return []
  }
}

function addCwd(file) {
  const cwd = process.cwd()
  const fileAbs = path.join(cwd, file)
  return fileAbs
}
