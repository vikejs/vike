import { resolve } from 'path'
import fs from 'fs'
import { execSync } from 'child_process'

export function updatePackageJson(successFullEjections: string[]) {
  const packageJson = JSON.parse(fs.readFileSync(resolve('./package.json'), 'utf-8'))
  packageJson['devDependencies'] = setPathAsVersion(packageJson['devDependencies'], successFullEjections)
  packageJson['dependencies'] = setPathAsVersion(packageJson['dependencies'], successFullEjections)
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

export function copyDependency(dependency: string) {
  const dependencyPath = resolve('./node_modules', dependency)
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

export function install() {
  const packageManager = detectPackageManager()
  execSync(`${packageManager} install`)
}

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
