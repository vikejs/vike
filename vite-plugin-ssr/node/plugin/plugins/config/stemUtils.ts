// Move to standalone package? E.g. https://www.npmjs.com/package/stem

export { getStemPackages }
export type { StemPackage }

import path from 'path'
import { assert, assertUsage, assertWarning, toPosixPath, assertPosixPath, getDependencyRootDir } from '../../utils.js'
import { import_ } from '@brillout/import'
import fs from 'fs'
import { createRequire } from 'module'
// @ts-ignore Shimed by dist-cjs-fixup.js for CJS build.
const importMetaUrl: string = import.meta.url
const require_ = createRequire(importMetaUrl)

type StemPackage = {
  stemPackageName: string
  stemPackageRootDir: string
  loadModule: (moduleId: string) => Promise<null | Record<string, unknown>>
}

async function getStemPackages(userAppRootDir: string): Promise<StemPackage[]> {
  const userRootDir = findUserRootDir(userAppRootDir)

  const userPkgJson = getUserPackageJson(userRootDir)

  const stemPkgNames = getStemPkgNames(userPkgJson)

  const stemPackages = await Promise.all(
    stemPkgNames.map((stemPackageName) => {
      assert(stemPackageName.includes('stem-'))
      const resolveModulePath = (moduleId: string): null | string => {
        const importPath = `${stemPackageName}/${moduleId}`
        try {
          const modulePath = require_.resolve(importPath, { paths: [userRootDir] })
          return modulePath
        } catch (err) {
          // - ERR_PACKAGE_PATH_NOT_EXPORTED => package.json#exports[importPath] is missing
          // - We assert that Stem pacakges always define package.json#exports down below
          if ((err as any).code === 'ERR_PACKAGE_PATH_NOT_EXPORTED') {
            return null
          }
          // All other errors such as ERR_MODULE_NOT_FOUND should be thrown
          throw err
        }
      }
      const loadModule = async (moduleId: string): Promise<null | Record<string, unknown>> => {
        const modulePath = resolveModulePath(moduleId)
        if (modulePath === null) return null
        const moduleExports: Record<string, unknown> = moduleId.endsWith('.json')
          ? require_(modulePath)
          : await import_(modulePath)
        return moduleExports
      }
      const stemPackageRootDir = getDependencyRootDir(stemPackageName, userAppRootDir)
      return {
        stemPackageName,
        stemPackageRootDir,
        loadModule
      }
    })
  )

  return stemPackages
}

function findUserRootDir(userAppRootDir: string): string {
  const userPkgJsonPath = findUserPackageJsonPath(userAppRootDir)
  assertUsage(userPkgJsonPath, `Couldn't find package.json in any parent directory starting from ${userAppRootDir}`)
  return toPosixPath(path.dirname(userPkgJsonPath))
}
function findUserPackageJsonPath(userAppRootDir: string): null | string {
  let dir = userAppRootDir
  while (true) {
    const configFilePath = path.join(dir, './package.json')
    if (fs.existsSync(configFilePath)) {
      return configFilePath
    }
    const dirPrevious = dir
    dir = path.dirname(dir)
    if (dir === dirPrevious) {
      return null
    }
  }
}

function getStemPkgNames(userPkgJson: UserPkgJson): string[] {
  const stemPkgNames = Object.keys(userPkgJson.dependencies ?? {}).filter((depName) => {
    if (depName.startsWith('stem-')) {
      assertWarning(
        false,
        `${depName} should be renamed to @someNpmOrgOrUser/${depName} (to follow the convention that all Stem packages belond to an npm organization)`,
        { onlyOnce: true }
      )
      return true
    }
    if (depName.split('/')[1]?.startsWith('stem-')) {
      return true
    }
    return false
  })
  return stemPkgNames
}

function getUserPackageJson(userRootDir: string): UserPkgJson {
  assertPosixPath(userRootDir)
  const userPkgJsonPath = path.posix.join(userRootDir, './package.json')
  let userPkgJson: UserPkgJson
  try {
    userPkgJson = require_(userPkgJsonPath)
  } catch {
    throw new Error(`No package.json found at ${userRootDir}`)
  }
  return userPkgJson
}

type UserPkgJson = { dependencies?: Record<string, string> }
