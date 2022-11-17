export { findConfigVpsFromStemPackages }

import type { ConfigVpsUserProvided } from './ConfigVps'
import { assert, createDebugger, isObject } from '../../utils'
import { getStemPackages } from './stemUtils'

const debug = createDebugger('vps:stem')

async function findConfigVpsFromStemPackages(root: string): Promise<ConfigVpsUserProvided[]> {
  const stemPackages = await getStemPackages(root)
  const configVpsFromStemPackages: ConfigVpsUserProvided[] = []
  debug(
    'Stem packages found:',
    stemPackages.map(({ stemPackageName, stemPackageRootDir }) => ({ stemPackageName, stemPackageRootDir }))
  )
  await Promise.all(
    stemPackages.map(async ({ loadModule }) => {
      const moduleExports = await loadModule('vite-plugin-ssr.config.js')
      const configVps: ConfigVpsUserProvided = moduleExports.default as any
      assert(isObject(configVps))
      configVpsFromStemPackages.push(configVps)
    })
  )
  return configVpsFromStemPackages
}
