export { commonConfig }

import type { Plugin, ResolvedConfig } from 'vite'
import { assert, assertUsage, assertWarning, findFile } from '../utils.js'
import { assertRollupInput } from './buildConfig.js'
import { installRequireShim_setUserRootDir } from '@brillout/require-shim'
import pc from '@brillout/picocolors'
import path from 'path'
import { createRequire } from 'module'
import { assertResolveAlias } from './commonConfig/assertResolveAlias.js'
// @ts-ignore Shimmed by dist-cjs-fixup.js for CJS build.
const importMetaUrl: string = import.meta.url
const require_ = createRequire(importMetaUrl)
const pluginName = 'vike:commonConfig-1'

function commonConfig(): Plugin[] {
  return [
    {
      name: pluginName,
      configResolved(config) {
        assertSingleInstance(config)
        installRequireShim_setUserRootDir(config.root)
      }
    },
    {
      name: 'vike:commonConfig-2',
      enforce: 'post',
      configResolved: {
        order: 'post',
        handler(config) {
          overrideViteDefaultPort(config)
          /* TODO: do this after implementing vike.config.js and new setting transformLinkedDependencies (or probably a better name like transpileLinkedDependencies/bundleLinkedDependencies or something else)
          overrideViteDefaultSsrExternal(config)
          //*/
          workaroundCI(config)
          assertRollupInput(config)
          assertResolveAlias(config)
          assertEsm(config.root)
        }
      }
    }
  ]
}

function overrideViteDefaultPort(config: ResolvedConfig) {
  // @ts-ignore
  config.server ??= {}
  config.server.port ??= 3000
  // @ts-ignore
  config.preview ??= {}
  config.preview.port ??= 3000
}
/*
import { version } from 'vite'
function overrideViteDefaultSsrExternal(config: ResolvedConfig) {
  if (!isVersionOrAbove(version, '5.0.12')) return
  // @ts-ignore Not released yet: https://github.com/vitejs/vite/pull/10939/files#diff-5a3d42620df2c6b17e25f440ffdb67683dee7ef57317674d19f41d5f30502310L5
  config.ssr.external ??= true
}
//*/

// Workaround GitHub Action failing to access the server
function workaroundCI(config: ResolvedConfig) {
  if (process.env.CI) {
    config.server.host ??= true
    config.preview.host ??= true
  }
}

function assertEsm(userViteRoot: string) {
  const packageJsonPath = findFile('package.json', userViteRoot)
  if (!packageJsonPath) return
  const packageJson = require_(packageJsonPath)
  let dir = path.dirname(packageJsonPath)
  if (dir !== '/') {
    assert(!dir.endsWith('/'))
    dir = dir + '/'
  }
  assert(dir.endsWith('/'))
  dir = pc.dim(dir)
  assertWarning(
    packageJson.type === 'module',
    `We recommend setting ${dir}package.json#type to "module", see https://vike.dev/CJS`,
    { onlyOnce: true }
  )
}

function assertSingleInstance(config: ResolvedConfig) {
  const numberOfInstances = config.plugins.filter((o) => o.name === pluginName).length
  assertUsage(
    numberOfInstances === 1,
    `Vike's Vite plugin (${pc.cyan(
      "'import vike from 'vike/plugin'"
    )}) is being added ${numberOfInstances} times to the list of Vite plugins. Make sure to add it only once instead.`
  )
}
