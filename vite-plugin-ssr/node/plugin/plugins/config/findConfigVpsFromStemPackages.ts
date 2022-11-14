export { findConfigVpsFromStemPackages }

import type { ConfigVpsUserProvided } from './ConfigVps'
import path from 'path'
import { assert, assertWarning, hasProp, isObject } from '../../utils'
import { import_ } from '@brillout/import'

async function findConfigVpsFromStemPackages(root: string): Promise<ConfigVpsUserProvided[]> {
  const userPackageJsonPath = path.posix.join(root, './package.json')
  let pkg: { dependencies: string[] }
  try {
    pkg = require(userPackageJsonPath)
  } catch {
    return []
  }
  if (!hasProp(pkg, 'dependencies', 'object')) {
    return []
  }
  const stemPackages = getStemPacakages(pkg.dependencies)
  const configVpsFromStemPackages: ConfigVpsUserProvided[] = []
  await Promise.all(
    stemPackages.map(async (pkgName) => {
      let mod: Record<string, unknown>
      try {
        mod = await import_(`${pkgName}/vite-plugin-ssr.config.js`)
      } catch {
        return
      }
      const configVps: ConfigVpsUserProvided = mod.default as any
      assert(isObject(configVps))
      configVpsFromStemPackages.push(configVps)
    })
  )
  return configVpsFromStemPackages
}

function getStemPacakages(dependencies: string[]) {
  const stemPackages = Object.keys(dependencies).filter((depName) => {
    if (depName.startsWith('stem-')) {
      assertWarning(
        false,
        `${depName} should be renamed to @someNpmOrg/${depName} (to follow the convention that all Stem packages belond to an npm organization)`,
        { onlyOnce: true }
      )
      return true
    }
    return depName.split('/')[1]?.startsWith('stem-')
  })
  return stemPackages
}
