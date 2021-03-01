import * as execa from 'execa'
import { readdirSync, writeFileSync, lstatSync } from 'fs'
import * as assert from 'assert'
import { DIR_BOILERPLATES, DIR_EXAMPLES, DIR_SRC, DIR_ROOT } from './_locations'
import * as semver from 'semver'

release()

async function release() {
  const { versionCurrent, versionNew } = getVersion()
  updateVersion(versionNew)
  updateDependencies({ versionNew, versionCurrent })
  await changelog()
  const tag = `v${versionNew}`
  await commit(tag)
  await commitTag(tag)
}

async function changelog() {
  await run('npx', [
    'conventional-changelog',
    '-p',
    'angular',
    '-i',
    'CHANGELOG.md',
    '-s',
    '--pkg',
    DIR_SRC
  ])
}
async function commit(tag: string) {
  assert(tag.startsWith('v0'))
  await run('git', ['commit', '-am', `release: ${tag}`])
}
async function commitTag(tag: string) {
  assert(tag.startsWith('v0'))
  await run('git', ['tag', tag])
}

function getVersion(): { versionNew: string; versionCurrent: string } {
  const pkg = require(`${DIR_SRC}/package.json`) as PackageJson
  const versionCurrent = pkg.version
  assert(versionCurrent)
  const versionNew = semver.inc(versionCurrent, 'prerelease')
  return { versionNew, versionCurrent }
}
function updateVersion(versionNew: string) {
  update([`${DIR_SRC}/package.json`], (pkg) => {
    pkg.version = versionNew
  })
}

function updateDependencies({ versionNew, versionCurrent }) {
  const pkgPaths = [
    ...retrievePkgPaths(DIR_BOILERPLATES),
    ...retrievePkgPaths(DIR_EXAMPLES)
  ]
  update(pkgPaths, (pkg) => {
    const version = pkg.dependencies['vite-plugin-ssr']
    assert(version)
    assert.strictEqual(version, `^${versionCurrent}`)
    pkg.dependencies['vite-plugin-ssr'] = `^${versionNew}`
  })
}

function retrievePkgPaths(rootDir: string): string[] {
  const directories = readdirSync(rootDir)
    .map((file) => `${rootDir}/${file}`)
    .filter((filePath) => !filePath.includes('node_modules'))
    .filter((filePath) => lstatSync(filePath).isDirectory())
  const pkgPaths = []
  for (const dir of directories) {
    const pkgPath = require.resolve(`${dir}/package.json`)
    pkgPaths.push(pkgPath)
  }
  return pkgPaths
}

function update(pkgPath: string[], updater: (pkg: PackageJson) => void) {
  pkgPath.forEach((pkgPath) => {
    const pkg = require(pkgPath) as PackageJson
    updater(pkg)
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
  })
}

type PackageJson = {
  version: string
  dependencies: {
    ['vite-plugin-ssr']: string
  }
}

async function run(cmd: string, args: string[]): Promise<void> {
  const stdio = 'inherit'
  const cwd = DIR_ROOT
  await execa(cmd, args, { cwd, stdio })
}
