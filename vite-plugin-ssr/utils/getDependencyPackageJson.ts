export { getDependencyPackageJson }
export { getDependencyPackageJsonPath }
export { getDependencyRootDir }

// There doesn't seem to be any alternative:
//  - https://stackoverflow.com/questions/74640378/find-and-read-package-json-of-a-dependency
//  - https://stackoverflow.com/questions/58442451/finding-the-root-directory-of-a-dependency-in-npm
//  - https://stackoverflow.com/questions/10111163/how-can-i-get-the-path-of-a-module-i-have-loaded-via-require-that-is-not-mine/63441056#63441056

import { assert } from './assert'
import { isNpmPackageName } from './isNpmPackageName'
import { toPosixPath } from './filesystemPathHandling'
import { isObject } from './isObject'
import path from 'path'
import fs from 'fs'

function getDependencyPackageJson(npmPackageName: string): Record<string, unknown> {
  const packageJsonPath = getDependencyPackageJsonPath(npmPackageName)
  const packageJson = fs.readFileSync(packageJsonPath, 'utf8')
  assert(isObject(packageJson))
  return packageJson
}

function getDependencyRootDir(npmPackageName: string): string {
  const rootDir = path.posix.dirname(getDependencyPackageJsonPath(npmPackageName))
  return rootDir
}

function getDependencyPackageJsonPath(npmPackageName: string): string {
  assert(isNpmPackageName(npmPackageName))
  let packageJsonPath: string
  try {
    packageJsonPath = require.resolve(`${npmPackageName}/package.json`)
  } catch (err_) {
    const err: { code?: string; message?: string } = err_ as any
    if (err.code !== 'ERR_PACKAGE_PATH_NOT_EXPORTED') {
      throw err
    }
    packageJsonPath = retrievePackageJsonPathFromErrMsg(err.message!)
  }
  packageJsonPath = toPosixPath(packageJsonPath)
  assert(packageJsonPath.endsWith('/package.json'), packageJsonPath) // package.json#exports["package.json"] may point to another file than package.json
  return packageJsonPath
}

/* Node.js 18 throws the following. Same for other Node.js versions? Let's see.
```
Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: Package subpath './package.json' is not defined by "exports" in /home/romuuu/.prog/files/code/vite-plugin-ssr/examples/stem-react/node_modules/@brillout/stem-react/package.json
    at __node_internal_captureLargerStackTrace (node:internal/errors:465:5)
    at new NodeError (node:internal/errors:372:5)
    at throwExportsNotFound (node:internal/modules/esm/resolve:440:9)
    at packageExportsResolve (node:internal/modules/esm/resolve:719:3)
    at resolveExports (node:internal/modules/cjs/loader:483:36)
    at Module._findPath (node:internal/modules/cjs/loader:523:31)
    at Module._resolveFilename (node:internal/modules/cjs/loader:925:27)
    at Function.resolve (node:internal/modules/cjs/helpers:108:19) {
  code: 'ERR_PACKAGE_PATH_NOT_EXPORTED'
}
```
*/
function retrievePackageJsonPathFromErrMsg(errMsg: string): string {
  const words = errMsg.split(' ')
  const match = words.filter((word) => word.endsWith('package.json'))
  assert(match.length === 1, errMsg)
  const filePath = match[0]!
  assert(path.isAbsolute(filePath), errMsg)
  return filePath
}
