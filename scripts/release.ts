import { readdirSync, writeFileSync, lstatSync } from 'fs'
import { join as pathJoin } from 'path'
import * as assert from 'assert'
import { DIR_BOILERPLATES, DIR_EXAMPLES, DIR_SRC } from './_locations'

type PackageJson = {
  version: string
  dependencies: {
    ['vite-plugin-ssr']: string
  }
}

release()

function release() {
  const { versionCurrent, versionNew } = getVersion()
  updateVersion(versionNew)
  updateDependencies({ versionNew, versionCurrent })
}

function getVersion(): { versionNew: string; versionCurrent: string } {
  const pkg = require(`${DIR_SRC}/package.json`) as PackageJson
  const versionCurrent = pkg.version
  assert(versionCurrent)
  const versionNew = getVersionNew() || versionCurrent
  return { versionNew, versionCurrent }
}
function updateVersion(versionNew: string) {
  update([`${DIR_SRC}/package.json`], (pkg) => {
    pkg.version = versionNew
  })
}
function getVersionNew(): string | undefined {
  const versionNew = process.argv[2]
  return versionNew
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
