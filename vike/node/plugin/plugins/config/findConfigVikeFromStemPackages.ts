export { findConfigVikeFromStemPackages }

import type { ConfigVikeUserProvided } from '../../../../shared/ConfigVike.js'
import { assert, createDebugger, isObject } from '../../utils.js'
import { getStemPackages } from './stemUtils.js'

const debug = createDebugger('vike:stem')

async function findConfigVikeFromStemPackages(root: string): Promise<ConfigVikeUserProvided[]> {
  if (isDeno()) return []
  const stemPackages = await getStemPackages(root)
  const configVikeFromStemPackages: ConfigVikeUserProvided[] = []
  debug(
    'Stem packages found:',
    stemPackages.map(({ stemPackageName, stemPackageRootDir }) => ({ stemPackageName, stemPackageRootDir }))
  )
  await Promise.all(
    stemPackages.map(async ({ loadModule }) => {
      const moduleExports = (await loadModule('vike.config.js')) || (await loadModule('vite-plugin-ssr.config.js'))
      if (!moduleExports) return
      const configVike: ConfigVikeUserProvided = moduleExports.default as any
      assert(isObject(configVike))
      configVikeFromStemPackages.push(configVike)
    })
  )
  return configVikeFromStemPackages
}

function isDeno(): boolean {
  // @ts-ignore
  return typeof Deno !== 'undefined' && Deno.env
}
