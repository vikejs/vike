export { findConfigVpsFromStemPackages }

import type { ConfigVpsUserProvided } from './ConfigVps'
import path from 'path'
import { assert, hasProp, isObject } from '../../utils'
import { import_ } from '@brillout/import'

async function findConfigVpsFromStemPackages(root: string): Promise<ConfigVpsUserProvided[]> {
  const userPackageJsonPath = path.posix.join(root, './package.json')
  let pkgJson: Record<string, unknown> = {}
  try {
    pkgJson = require(userPackageJsonPath)
  } catch {
    return []
  }
  if (!hasProp(pkgJson, 'dependencies', 'object')) {
    return []
  }
  const stemPackages = Object.keys(pkgJson.dependencies).filter((depName) => depName.split('/')[1]?.startsWith('stem-'))
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
