export { getDependencyPackageJson }
export { getDependencyPackageJsonPath }
export { getDependencyRootDir }

// There doesn't seem to be any alternative:
//  - https://github.com/antfu/local-pkg
//  - https://stackoverflow.com/questions/74640378/find-and-read-package-json-of-a-dependency
//  - https://stackoverflow.com/questions/58442451/finding-the-root-directory-of-a-dependency-in-npm
//  - https://stackoverflow.com/questions/10111163/how-can-i-get-the-path-of-a-module-i-have-loaded-via-require-that-is-not-mine/63441056#63441056

import { assert, assertUsage } from './assert.js'
import { isNpmPackageName } from './isNpmPackage.js'
import { toPosixPath } from './filesystemPathHandling.js'
import { isObject } from './isObject.js'
import path from 'path'
import fs from 'fs'
import { assertIsNotProductionRuntime } from './assertIsNotProductionRuntime.js'
import { createRequire } from 'module'
// @ts-ignore Shimed by dist-cjs-fixup.js for CJS build.
const importMetaUrl: string = import.meta.url
const require_ = createRequire(importMetaUrl)
assertIsNotProductionRuntime()

function getDependencyPackageJson(npmPackageName: string, userAppRootDir: string): Record<string, unknown> {
  const packageJsonPath = getDependencyPackageJsonPath(npmPackageName, userAppRootDir)
  const packageJson = fs.readFileSync(packageJsonPath, 'utf8')
  assert(isObject(packageJson))
  return packageJson
}

function getDependencyRootDir(npmPackageName: string, userAppRootDir: string): string {
  const rootDir = path.posix.dirname(getDependencyPackageJsonPath(npmPackageName, userAppRootDir))
  return rootDir
}

function getDependencyPackageJsonPath(npmPackageName: string, userAppRootDir: string): string {
  assert(isNpmPackageName(npmPackageName))
  let packageJsonPath = resolvePackageJsonDirectly(npmPackageName, userAppRootDir)

  if (!packageJsonPath) {
    packageJsonPath = resolvePackageJsonWithMainEntry(npmPackageName, userAppRootDir)
  }

  assertUsage(
    packageJsonPath,
    `Cannot read ${npmPackageName}/package.json. Define package.json#exports["./package.json"] with the value "./package.json" in the package.json of ${npmPackageName}.`
  )

  packageJsonPath = toPosixPath(packageJsonPath)
  assert(packageJsonPath.endsWith('/package.json'), packageJsonPath) // package.json#exports["package.json"] may point to another file than package.json
  return packageJsonPath
}

function resolvePackageJsonDirectly(npmPackageName: string, userAppRootDir: string): null | string {
  let packageJsonPath: string
  try {
    packageJsonPath = require_.resolve(`${npmPackageName}/package.json`, { paths: [userAppRootDir] })
  } catch (err) {
    if (isUnexpectedError(err)) throw err
    return null
  }
  return packageJsonPath
}

function resolvePackageJsonWithMainEntry(npmPackageName: string, userAppRootDir: string): null | string {
  let mainEntry: string
  try {
    mainEntry = require_.resolve(npmPackageName, { paths: [userAppRootDir] })
  } catch (err) {
    if (isUnexpectedError(err)) throw err
    return null
  }
  const packageJsonPath = searchPackageJSON(mainEntry)
  return packageJsonPath
}

// If the npm package doesn't define package.json#exports then require.resolve(`${npmPackageName}/package.json`) just works.
// This means we can assume packageJson#exports to be defined and, consequently, we can assume the error code to always be ERR_PACKAGE_PATH_NOT_EXPORTED.
// (If MODULE_NOT_FOUND is thrown then this means that npmPackageName isn't installed.)
function isUnexpectedError(err: any): boolean {
  return err?.code !== 'ERR_PACKAGE_PATH_NOT_EXPORTED'
}

// Copied and adapted from https://github.com/antfu/local-pkg
function searchPackageJSON(dir: string): string {
  let packageJsonPath
  while (true) {
    assert(dir)
    const newDir = path.dirname(dir)
    assert(newDir !== dir)
    dir = newDir
    packageJsonPath = path.join(dir, 'package.json')
    if (fs.existsSync(packageJsonPath)) return packageJsonPath
  }
}
