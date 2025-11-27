export { pluginReplaceConstantsEnvVars }

import type { Plugin, ResolvedConfig } from 'vite'
import { loadEnv } from 'vite'
import {
  assert,
  assertPosixPath,
  assertUsage,
  assertWarning,
  escapeRegex,
  isArray,
  isNotNullish,
  lowerFirst,
} from '../utils.js'
import { getFilePathToShowToUserModule } from '../shared/getFilePath.js'
import { normalizeId } from '../shared/normalizeId.js'
import { isViteServerSide_extraSafe } from '../shared/isViteServerSide.js'
import { getMagicString } from '../shared/getMagicString.js'

const PUBLIC_ENV_PREFIX = 'PUBLIC_ENV__'
const PUBLIC_ENV_ALLOWLIST = [
  // https://github.com/vikejs/vike/issues/1724
  'STORYBOOK',
]

// TO-DO/eventually:
// - Make import.meta.env work inside +config.js
//   - For it to work, we'll probably need the user to define the settings (e.g. `envDir`) for loadEnv() inside vike.config.js instead of vite.config.js
//   - Or stop using Vite's `mode` implementation and have Vike implement its own `mode` feature? (So that the only dependencies are `$ vike build --mode staging` and `$ MODE=staging vike build`.)

const skipNodeModules = '/node_modules/'
const skipIrrelevant = 'import.meta.env.'
const filterRolldown = {
  id: {
    exclude: `**${skipNodeModules}**`,
  },
  code: {
    include: skipIrrelevant,
  },
}
const filterFunction = (id: string, code: string) => {
  if (id.includes(skipNodeModules)) return false
  if (!code.includes(skipIrrelevant)) return false
  return true
}

function pluginReplaceConstantsEnvVars(): Plugin[] {
  let envVarsAll: Record<string, string>
  let envPrefix: string[]
  let config: ResolvedConfig
  return [
    {
      name: 'vike:pluginReplaceConstantsEnvVars:pre',
      enforce: 'post',
      config: {
        order: 'post',
        handler() {
          return {
            define: {
              'import.meta.env': JSON.stringify(42),
              __vite_import_meta_env__: JSON.stringify(42),
              // 'import.meta.env2': JSON.stringify(43),
              TE3: JSON.stringify(1),
            },
          }
        },
      },
    },
    {
      name: 'vike:pluginReplaceConstantsEnvVars:post',
      enforce: 'post',
      configResolved: {
        handler(config_) {
          config = config_
          envVarsAll = loadEnv(config.mode, config.envDir || config.root, '')
          envPrefix = getEnvPrefix(config)
          // Vite's built-in plugin vite:define needs to apply after this plugin.
          //  - This plugin vike:pluginReplaceConstantsEnvVars needs to apply after vike:pluginExtractAssets and vike:pluginExtractExportNames which need to apply after @vitejs/plugin-vue
          ;(config.plugins as Plugin[]).sort(lowerFirst<Plugin>((plugin) => (plugin.name === 'vite:define' ? 1 : 0)))
          // console.log((config.plugins as Plugin[]).map((plugin) => (plugin.name)))
        },
      },
      transform: {
        // filter: filterRolldown,
        handler(code, id, options) {
          if (code.includes('import.meta.env2')) {
            console.log('code', code)
          }
          id = normalizeId(id)
          assertPosixPath(id)
          assertPosixPath(config.root)
          if (!id.startsWith(config.root)) return // skip linked dependencies
          // assert(filterFunction(id, code))

          const isBuild = config.command === 'build'
          const isClientSide = !isViteServerSide_extraSafe(config, this.environment, options)

          const { magicString, getMagicStringResult } = getMagicString(code, id)

          // Get regex operations
          const replacements = Object.entries(envVarsAll)
            // Skip env vars that start with [`config.envPrefix`](https://vite.dev/config/shared-options.html#envprefix) — they are already handled by Vite
            .filter(([envName]) => !envPrefix.some((prefix) => envName.startsWith(prefix)))
            // Skip constants like import.meta.env.DEV which are already handled by Vite
            .filter(([envName]) => !['DEV', 'PROD', 'SSR', 'MODE', 'BASE_URL'].includes(envName))
            .map(([envName, envVal]) => {
              const envStatement = `import.meta.env.${envName}` as const
              const envStatementRegExpStr = escapeRegex(envStatement) + '\\b'

              // Show error (warning in dev) if client code contains a private environment variable (one that doesn't start with PUBLIC_ENV__ and that isn't included in `PUBLIC_ENV_ALLOWLIST`).
              if (isClientSide) {
                const skip = assertNoClientSideLeak({
                  envName,
                  envStatement,
                  envStatementRegExpStr,
                  code,
                  id,
                  config,
                  isBuild,
                })
                if (skip) return null
              }

              return { regExpStr: envStatementRegExpStr, replacement: envVal }
            })
            .filter(isNotNullish)

          // Apply regex operations
          replacements.forEach(({ regExpStr, replacement }) => {
            magicString.replaceAll(new RegExp(regExpStr, 'g'), JSON.stringify(replacement))
          })

          return getMagicStringResult()
        },
      },
    },
  ]
}

function getEnvPrefix(config: ResolvedConfig): string[] {
  const { envPrefix } = config
  if (!envPrefix) return []
  if (!isArray(envPrefix)) return [envPrefix]
  return envPrefix
}

function assertNoClientSideLeak({
  envName,
  envStatement,
  envStatementRegExpStr,
  code,
  id,
  config,
  isBuild,
}: {
  envName: string
  envStatement: string
  envStatementRegExpStr: string
  code: string
  id: string
  config: ResolvedConfig
  isBuild: boolean
}): undefined | true {
  const isPrivate = !envName.startsWith(PUBLIC_ENV_PREFIX) && !PUBLIC_ENV_ALLOWLIST.includes(envName)
  // ✅ All good
  if (!isPrivate) return
  if (!new RegExp(envStatementRegExpStr).test(code)) return true

  // ❌ Security leak!
  // - Warning in dev
  // - assertUsage() and abort when building for production
  const modulePath = getFilePathToShowToUserModule(id, config)
  const errMsgAddendum: string = isBuild ? '' : ' (Vike will prevent your app from building for production)'
  const envNameFixed = `${PUBLIC_ENV_PREFIX}${envName}` as const
  const errMsg =
    `${envStatement} is used in client-side file ${modulePath} which means that the environment variable ${envName} will be included in client-side bundles and, therefore, ${envName} will be publicly exposed which can be a security leak${errMsgAddendum}. Use ${envStatement} only in server-side files, or rename ${envName} to ${envNameFixed}, see https://vike.dev/env` as const

  if (isBuild) {
    assertUsage(false, errMsg)
  } else {
    // - Only a warning for faster development DX (e.g. when user toggles `ssr: boolean` or `onBeforeRenderIsomorph: boolean`).
    // - Although only showing a warning can be confusing: https://github.com/vikejs/vike/issues/1641
    assertWarning(false, errMsg, { onlyOnce: true })
  }

  assert(!isBuild) // we should abort if building for production
}
