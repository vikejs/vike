export { findConfigVpsFromStemPackages }

import type { ConfigVpsUserProvided } from '../../../../shared/ConfigVps.js'
import { assert, createDebugger, isObject } from '../../utils.js'
import { getStemPackages } from './stemUtils.js'

const debug = createDebugger('vps:stem')

async function findConfigVpsFromStemPackages(root: string): Promise<ConfigVpsUserProvided[]> {
  if (isDeno()) return []
  const stemPackages = await getStemPackages(root)
  const configVpsFromStemPackages: ConfigVpsUserProvided[] = []
  debug(
    'Stem packages found:',
    stemPackages.map(({ stemPackageName, stemPackageRootDir }) => ({ stemPackageName, stemPackageRootDir }))
  )
  await Promise.all(
    stemPackages.map(async ({ loadModule }) => {
      const moduleExports = await loadModule('vite-plugin-ssr.config.js')
      if (!moduleExports) return
      const configVps: ConfigVpsUserProvided = moduleExports.default as any
      assert(isObject(configVps))
      configVpsFromStemPackages.push(configVps)
    })
  )
  return configVpsFromStemPackages
}

function isDeno(): boolean {
  // @ts-ignore
  return typeof Deno !== 'undefined' && Deno.env
}
