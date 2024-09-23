import { cac } from 'cac'
import { resolve } from 'path'
import fs from 'fs'
import { simpleGit, CleanOptions } from 'simple-git'

const projectVersion = '0.0.1'
const cli = cac('eject')

cli
  .command('[...dependencies]', 'Ejects a dependency from node_modules', { allowUnknownOptions: true })
  .option('-m, --message <message>', 'Commit message')
  .option('-f, --force', 'Bypass git history check')
  .option('-si, --skip-install', 'Skip install and commit after ejection')
  .action(async (dependencies, options) => {
    if (!options.force && !(await isGitHistoryClean())) {
      console.log('Please commit your changes before ejecting dependencies')
      return
    }
    const successFullEjections = []
    for (const dependency of dependencies) {
      try {
        await copyDependency(dependency)
        successFullEjections.push(dependency)
      } catch (error) {
        console.log(error)
        console.log('Error ejecting dependency:', dependency)
      }
    }
    console.log('Ejected dependencies:', successFullEjections)
    if (successFullEjections.length > 0) {
      await updatePackageJson(successFullEjections)
      console.log('We updated your package.json and linked the dependencies to the ejected folder')
      console.log('Will finalize the ejection by running install')
      if (!options.skipInstall) {
        install()
        await commitEjection(options.message)
      }
    } else {
      console.log('No dependencies ejected')
    }
  })

async function commitEjection(commitMessage: string = 'Eject dependencies') {
  const git = simpleGit()
  await git.add('.')
  await git.commit(commitMessage)
}

async function isGitHistoryClean() {
  console.log('Checking git history')
  const git = simpleGit()
  const isRepo = await git.checkIsRepo()
  if (!isRepo) {
    return true
  }
  const status = await git.status()
  return status.files.length === 0
}

function install() {
  const packageManager = detectPackageManager()
  execSync(`${packageManager} install`)
}

function updatePackageJson(successFullEjections: string[]) {
  const packageJson = JSON.parse(fs.readFileSync(resolve('./package.json'), 'utf-8'))
  console.log('Package JSON:', packageJson)
  packageJson['devDependencies'] = setPathAsVersion(packageJson['devDependencies'], successFullEjections)
  packageJson['dependencies'] = setPathAsVersion(packageJson['dependencies'], successFullEjections)
  console.log('Updated package JSON:', packageJson)
  fs.writeFileSync(resolve('./package.json'), JSON.stringify(packageJson, null, 2))
  return true
}

function setPathAsVersion(dependencies: Record<string, string>, successFullEjections: string[]) {
  const updatedDependencies: Record<string, string> = {}
  for (const key in dependencies) {
    if (!successFullEjections.includes(key)) {
      updatedDependencies[key] = dependencies[key] as string
    } else {
      updatedDependencies[key] = `file:./ejected/${key}`
    }
  }
  return updatedDependencies
}

async function copyDependency(dependency: string) {
  const dependencyPath = resolve('./node_modules', dependency)
  console.log('Dependency path:', dependencyPath)
  if (!fs.existsSync(dependencyPath)) {
    throw new Error('Dependency not found in node_modules')
  }

  if (!fs.existsSync('./ejected')) {
    fs.mkdirSync('./ejected')
  }
  if (fs.existsSync(resolve('./ejected', dependency))) {
    throw new Error('Dependency already ejected')
  }

  fs.cpSync(dependencyPath, resolve('./ejected', dependency), {
    recursive: true,
    force: true
  })
}

import { execSync } from 'child_process'

function detectPackageManager() {
  // Check npm_config_user_agent first
  const agent = process.env.npm_config_user_agent
  if (agent) {
    const [program] = agent.toLowerCase().split('/')
    if (program === 'yarn') return 'yarn'
    if (program === 'pnpm') return 'pnpm'
    if (program === 'npm') return 'npm'
    if (program === 'bun') return 'bun'
  }

  // Check npm_execpath for yarn
  if (process.env.npm_execpath && process.env.npm_execpath.endsWith('yarn.js')) {
    return 'yarn'
  }

  // Check npm_command for npm
  if (process.env.npm_command) {
    return 'npm'
  }

  // Check _ environment variable as a last resort
  const parent = process.env._
  if (parent) {
    if (parent.endsWith('pnpx') || parent.endsWith('pnpm')) return 'pnpm'
    if (parent.endsWith('yarn')) return 'yarn'
    if (parent.endsWith('npm')) return 'npm'
    if (parent.endsWith('bun')) return 'bun'
  }

  // If all else fails, assume npm
  return 'npm'
}

cli.help()
cli.version(projectVersion)

cli.parse(process.argv.length === 2 ? [...process.argv, '--help'] : process.argv)

process.on('unhandledRejection', (rejectValue) => {
  throw rejectValue
})
