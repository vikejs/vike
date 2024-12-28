export { commonConfig }

import type { Plugin, ResolvedConfig, UserConfig } from 'vite'
import { assert, assertUsage, assertWarning, findPackageJson, isDocker } from '../utils.js'
import { assertRollupInput } from './buildConfig.js'
import { installRequireShim_setUserRootDir } from '@brillout/require-shim'
import pc from '@brillout/picocolors'
import path from 'path'
import { assertResolveAlias } from './commonConfig/assertResolveAlias.js'
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
          /* TODO: do this after implementing vike.config.js and new setting transformLinkedDependencies (or probably a better name like transpileLinkedDependencies/bundleLinkedDependencies or something else)
          overrideViteDefaultSsrExternal(config)
          //*/
          workaroundCI(config)
          assertRollupInput(config)
          assertResolveAlias(config)
          assertEsm(config.root)
        }
      },
      // Override Vite's default port without overriding the user
      config: {
        order: 'post',
        handler(configFromUser) {
          const configFromVike: UserConfig = { server: {}, preview: {} }
          setDefault('port', 3000, configFromUser, configFromVike)
          if (isDocker()) {
            setDefault('host', true, configFromUser, configFromVike)
          }
          return configFromVike
        }
      }
    }
  ]
}

function setDefault<Setting extends 'port' | 'host'>(
  setting: Setting,
  value: NonNullable<UserConfig['server'] | UserConfig['preview']>[Setting],
  configFromUser: UserConfig,
  configFromVike: UserConfig
) {
  if (configFromUser.server?.[setting] === undefined) configFromVike.server![setting] = value
  if (configFromUser.preview?.[setting] === undefined) configFromVike.preview![setting] = value
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
  const found = findPackageJson(userViteRoot)
  if (!found) return
  const { packageJson, packageJsonPath } = found
  let dir = path.posix.dirname(packageJsonPath)
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
      "import vike from 'vike/plugin'"
    )}) is being added ${numberOfInstances} times to the list of Vite plugins. Make sure to add it only once instead.`
  )
}
