export { commonConfig }
export { getVikeConfigPublic }
export { getVikeConfigInternal }
export type { VikeConfigPublic }

import { type InlineConfig, type Plugin, type ResolvedConfig, type UserConfig } from 'vite'
import {
  assert,
  assertUsage,
  assertWarning,
  findPackageJson,
  hasProp,
  isDevCheck,
  isDocker,
  isObject,
  isVitest
} from '../utils.js'
import { assertRollupInput } from './build/pluginBuildConfig.js'
import { installRequireShim_setUserRootDir } from '@brillout/require-shim'
import pc from '@brillout/picocolors'
import path from 'path'
import { assertResolveAlias } from './commonConfig/assertResolveAlias.js'
import { isViteCliCall } from '../shared/isViteCliCall.js'
import { isVikeCliOrApi } from '../../api/context.js'
import { getVikeConfig3, setVikeConfigCtx, type VikeConfigObject } from './importUserCode/v1-design/getVikeConfig.js'
import { assertViteRoot, getViteRoot, normalizeViteRoot } from '../../api/prepareViteApiCall.js'
import { temp_disablePrerenderAutoRun } from '../../prerender/context.js'
import type { PrerenderContextPublic } from '../../prerender/runPrerender.js'
import type { VitePluginServerEntryOptions } from '@brillout/vite-plugin-server-entry/plugin'
import { resolvePrerenderConfigGlobal } from '../../prerender/resolvePrerenderConfig.js'
const pluginName = 'vike:commonConfig'

declare module 'vite' {
  interface UserConfig {
    _isDev?: boolean
    vitePluginServerEntry?: VitePluginServerEntryOptions
    _root?: string
    _baseViteOriginal?: string
    // We'll be able to remove once we have one Rolldown build instead of two Rollup builds
    _viteConfigFromUserEnhanced?: InlineConfig
    // TODO/now-1: remove / add comment
    _vike?: VikeConfigPublic
    // TODO/now-1: remove?
    _vikeConfigObject?: VikeConfigObject
  }
}

// TODO/now-1: rename
type VikeConfigPublic = {
  config: VikeConfigObject['global']['config']
  pages: VikeConfigObject['pages']
  prerenderContext: PrerenderContext
}

type PrerenderContext = {
  isPrerenderingEnabled: boolean
  isPrerenderingEnabledForAllPages: boolean
} & ({ [K in keyof PrerenderContextPublic]: null } | PrerenderContextPublic)

function commonConfig(vikeVitePluginOptions: unknown): Plugin[] {
  // We cache it => makes sure we only generate one object => we can mutate it at runPrerender()
  let prerenderContext: PrerenderContext
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
          setVikeConfigCtx({ userRootDir: root, isDev, vikeVitePluginOptions })
          const vikeConfig = await getVikeConfig3()
          const { isPrerenderingEnabled, isPrerenderingEnabledForAllPages } = resolvePrerenderConfigGlobal(vikeConfig)
          prerenderContext ??= {
            isPrerenderingEnabled,
            isPrerenderingEnabledForAllPages,
            output: null,
            pageContexts: null
          }
          assert(prerenderContext.isPrerenderingEnabled === isPrerenderingEnabled)
          assert(prerenderContext.isPrerenderingEnabledForAllPages === isPrerenderingEnabledForAllPages)
          return {
            _isDev: isDev,
            _root: root,
            _vikeConfigObject: vikeConfig,
            _vike: {
              pages: vikeConfig.pages,
              config: vikeConfig.global.config,
              prerenderContext
            },
            // TODO/v1-release: remove https://github.com/vikejs/vike/issues/2122
            configVikePromise: Promise.resolve({
              prerender: isPrerenderingEnabled
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
          emitServerEntryOnlyIfNeeded(config)
        }
      },
      config: {
        order: 'post',
        handler(configFromUser) {
          let configFromVike: UserConfig = { server: {}, preview: {} }
          const vike = getVikeConfigInternal(configFromUser)

          if (vike.config.port !== undefined) {
            // https://vike.dev/port
            setDefault('port', vike.config.port, configFromUser, configFromVike)
          } else {
            // Change Vite's default port
            setDefault('port', 3000, configFromUser, configFromVike)
          }

          if (vike.config.host) {
            // https://vike.dev/host
            setDefault('host', vike.config.host, configFromUser, configFromVike)
          } else if (isDocker()) {
            // Set `--host` for Docker/Podman
            setDefault('host', true, configFromUser, configFromVike)
          }

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
    assert(!isVitest())
    assertWarning(false, `Vite's CLI is deprecated ${pc.underline('https://vike.dev/migration/cli')}`, {
      onlyOnce: true
    })
    return
  }
  if (isVitest()) {
    assertWarning(
      false,
      `Unexpected Vitest setup: you seem to be using Vitest together with Vike's Vite plugin but without using Vike's JavaScript API which is unexpected, see ${pc.underline('https://vike.dev/vitest')}`,
      { onlyOnce: true }
    )
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
// - `getVikeConfigInternal()` => `getVikeConfig()`
// - `VikeConfigPublic` => `VikeConfig` ?
// - `VikeConfigObject` => `VikeConfigInternal` ?
function getVikeConfigInternal(config: ResolvedConfig | UserConfig): VikeConfigPublic {
  const vikeConfig = config._vike
  assert(vikeConfig)
  return vikeConfig
}
/**
 * Get all the information Vike knows about the app in your Vite plugin.
 *
 * https://vike.dev/getVikeConfig
 */
function getVikeConfigPublic(config: ResolvedConfig | UserConfig): VikeConfigPublic {
  const vikeConfig = config._vike
  assertUsage(vikeConfig, "getVikeConfig() can only be used when Vite is running with Vike's Vite plugin")
  return vikeConfig
}

// Only emit dist/server/entry.mjs if necessary
function emitServerEntryOnlyIfNeeded(config: ResolvedConfig) {
  if (
    config.vitePluginServerEntry?.inject &&
    !resolvePrerenderConfigGlobal(config._vikeConfigObject!).isPrerenderingEnabled
  ) {
    config.vitePluginServerEntry.disableServerEntryEmit = true
  }
}
