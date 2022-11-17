// Move to standalone package? E.g. https://www.npmjs.com/package/stem

export { getStemPackages }
export type { StemPackage }

import path from 'path'
import { assert, assertWarning, toPosixPath, assertPosixPath } from '../../utils'
import { import_ } from '@brillout/import'

type StemPackage = {
  stemPackageName: string
  stemPackageRootDir: string
  loadModule: (moduleId: string) => Promise<Record<string, unknown>>
}

async function getStemPackages(userRootDir: string): Promise<StemPackage[]> {
  userRootDir = toPosixPath(userRootDir)

  const userPkgJson = getUserPackageJson(userRootDir)

  const stemPkgNames = getStemPkgNames(userPkgJson)

  const stemPackages = await Promise.all(
    stemPkgNames.map((stemPackageName) => {
      assert(stemPackageName.includes('stem-'))
      const resolveModulePath = (moduleId: string): string => {
        const importPath = `${stemPackageName}/${moduleId}`
        const modulePath = require.resolve(importPath, { paths: [userRootDir] })
        // assertUsage(false, `Make sure to (properly) set \`${stemPackageName}#exports['./${moduleId}']\``)
        // if ((err as any).code === 'ERR_MODULE_NOT_FOUND') {
        //   assertUsage(false, `Couldn't find ${importPath}`)
        // }
        return modulePath
      }
      const loadModule = async (moduleId: string): Promise<Record<string, unknown>> => {
        const modulePath = resolveModulePath(moduleId)
        const moduleExports: Record<string, unknown> = moduleId.endsWith('.json')
          ? require(modulePath)
          : await import_(modulePath)
        return moduleExports
      }
      const stemPackageJsonPath = resolveModulePath('package.json')
      const stemPackageRootDir = toPosixPath(path.dirname(stemPackageJsonPath))
      return {
        stemPackageName,
        stemPackageRootDir,
        loadModule
      }
    })
  )

  return stemPackages
}

function getStemPkgNames(userPkgJson: UserPkgJson): string[] {
  const stemPkgNames = Object.keys(userPkgJson.dependencies ?? {}).filter((depName) => {
    if (depName.startsWith('stem-')) {
      assertWarning(
        false,
        `${depName} should be renamed to @someNpmOrg/${depName} (to follow the convention that all Stem packages belond to an npm organization)`,
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
    userPkgJson = require(userPkgJsonPath)
  } catch {
    throw new Error(`No package.json found at ${userRootDir}`)
  }
  return userPkgJson
}

type UserPkgJson = { dependencies?: Record<string, string> }
