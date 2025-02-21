export { commonConfig }
export { getVikeConfigPublic }

import { type InlineConfig, mergeConfig, type Plugin, type ResolvedConfig, type UserConfig } from 'vite'
import {
  assert,
  assertUsage,
  assertWarning,
  findPackageJson,
  hasProp,
  isDevCheck,
  isDocker,
  isObject
} from '../utils.js'
import { assertRollupInput } from './pluginBuildConfig.js'
import { installRequireShim_setUserRootDir } from '@brillout/require-shim'
import pc from '@brillout/picocolors'
import path from 'path'
import { assertResolveAlias } from './commonConfig/assertResolveAlias.js'
import { getEnvVarObject } from '../shared/getEnvVarObject.js'
import { isViteCliCall } from '../shared/isViteCliCall.js'
import { isVikeCliOrApi } from '../../api/context.js'
import { getVikeConfig2, type VikeConfigObject } from './importUserCode/v1-design/getVikeConfig.js'
import { assertViteRoot, getViteRoot, normalizeViteRoot } from '../../api/prepareViteApiCall.js'
import { isPrerenderEnabled, temp_disablePrerenderAutoRun } from '../../prerender/context.js'
import type { PrerenderContextPublic } from '../../prerender/runPrerender.js'
const pluginName = 'vike:commonConfig'

declare module 'vite' {
  interface UserConfig {
    _isDev?: boolean
    _vikeVitePluginOptions?: unknown
    _root?: string
    _baseViteOriginal?: string
    // We'll be able to remove once we have one Rolldown build instead of two Rollup builds
    _viteConfigEnhanced?: InlineConfig
    _vike?: VikeConfigPublic
  }
}

type VikeConfigPublic = {
  config: VikeConfigObject['global']['config']
  pages: VikeConfigObject['pages']
  prerenderContext?: PrerenderContextPublic
}

function commonConfig(vikeVitePluginOptions: unknown): Plugin[] {
  return [
    {
      name: `${pluginName}:pre`,
      enforce: 'pre',
      config: {
        order: 'pre',
        async handler(configFromUser, env) {
          const isDev = isDevCheck(env)
          const operation = env.command === 'build' ? 'build' : env.isPreview ? 'preview' : 'dev'
          const root = configFromUser.root ? normalizeViteRoot(configFromUser.root) : await getViteRoot(operation)
          assert(root)
          const vikeConfig = await getVikeConfig2(root, isDev, vikeVitePluginOptions)
          return {
            _isDev: isDev,
            _root: root,
            _vikeVitePluginOptions: vikeVitePluginOptions,
            _vike: {
              pages: vikeConfig.pages,
              config: vikeConfig.global.config
            },
            // TODO/v1-release: remove https://github.com/vikejs/vike/issues/2122
            configVikePromise: Promise.resolve({
              prerender: isPrerenderEnabled(vikeConfig)
            })
          }
        }
      }
    },
    {
      name: pluginName,
      configResolved(config) {
        assertViteRoot(config._root!, config)
        assertSingleInstance(config)
        installRequireShim_setUserRootDir(config.root)
      }
    },
    {
      name: `${pluginName}:post`,
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
          assertVikeCliOrApi(config)
          temp_supportOldInterface(config)
        }
      },
      config: {
        order: 'post',
        handler(configFromUser) {
          // Change default port
          let configFromVike: UserConfig = { server: {}, preview: {} }
          setDefault('port', 3000, configFromUser, configFromVike)

          // Set `--host` for Docker/Podman
          if (isDocker()) {
            setDefault('host', true, configFromUser, configFromVike)
          }

          // VITE_CONFIG
          const configFromEnvVar = getEnvVarObject('VITE_CONFIG')
          if (configFromEnvVar) configFromVike = mergeConfig(configFromVike, configFromEnvVar)

          return configFromVike
        }
      }
    }
  ]
}

// Override Vite's default value without overriding user settings
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

function assertVikeCliOrApi(config: ResolvedConfig) {
  if (isVikeCliOrApi()) return
  if (isViteCliCall()) {
    assertWarning(false, `Vite's CLI is deprecated ${pc.underline('https://vike.dev/migration/cli')}`, {
      onlyOnce: true
    })
    return
  }
  if (config.server.middlewareMode) {
    assertWarning(
      false,
      `${pc.cyan('vite.createServer()')} is deprecated ${pc.underline('https://vike.dev/migration/cli#api')}`,
      {
        onlyOnce: true
      }
    )
    return
  }
  assertWarning(false, `Vite's JavaScript API is deprecated ${pc.underline('https://vike.dev/migration/cli#api')}`, {
    onlyOnce: true
  })
}

// TODO/v1-release: remove https://github.com/vikejs/vike/issues/2122
function temp_supportOldInterface(config: ResolvedConfig) {
  if (!('vitePluginSsr' in config)) return
  assert(isObject(config.vitePluginSsr))
  if (hasProp(config.vitePluginSsr, 'prerender', 'object')) {
    assert(hasProp(config.vitePluginSsr.prerender, 'disableAutoRun', 'boolean'))
    if (config.vitePluginSsr.prerender.disableAutoRun) {
      temp_disablePrerenderAutoRun()
    }
    return
  }
  if (hasProp(config.vitePluginSsr, 'disableAutoFullBuild')) {
    if (config.vitePluginSsr.disableAutoFullBuild) {
      assert(config.vitePluginSsr.disableAutoFullBuild === 'prerender')
      temp_disablePrerenderAutoRun()
    }
    return
  }
  assert(false)
}

// TODO/soon rename:
// - `getVikeConfig()` => `resolveVikeConfig()` ?
// - `getVikeConfigPublic()` => `getVikeConfig()`
// - `VikeConfigPublic` => `VikeConfig` ?
// - `VikeConfigObject` => `VikeConfigInternal` ?
/**
 * Get all the information Vike knows about the app in your Vite plugin.
 *
 * https://vike.dev/getVikeConfig
 */
function getVikeConfigPublic(config: ResolvedConfig | UserConfig): VikeConfigPublic {
  const vikeConfig = config._vike
  assert(vikeConfig)
  return vikeConfig
}
