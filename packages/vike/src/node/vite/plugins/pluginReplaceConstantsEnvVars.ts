import '../assertEnvVite.js'

export { pluginReplaceConstantsEnvVars }

import type { Plugin, ResolvedConfig } from 'vite'
import { loadEnv } from 'vite'
import { escapeRegex } from '../../../utils/escapeRegex.js'
import { isNotNullish } from '../../../utils/isNullish.js'
import { assert, assertUsage, assertWarning } from '../../../utils/assert.js'
import { isArray } from '../../../utils/isArray.js'
import { makeLast } from '../../../utils/sorter.js'
import { assertPosixPath } from '../../../utils/path.js'
import { getFilePathToShowToUserModule } from '../shared/getFilePath.js'
import { normalizeId } from '../shared/normalizeId.js'
import { isViteServerSide_extraSafe } from '../shared/isViteServerSide.js'
import { getMagicString } from '../shared/getMagicString.js'
import pc from '@brillout/picocolors'

const PUBLIC_ENV_PREFIX = 'PUBLIC_ENV__'
const PUBLIC_ENV_ALLOWLIST = [
  // https://github.com/vikejs/vike/issues/1724
  'STORYBOOK',
  // https://github.com/vikejs/vike/pull/3069
  'DEBUG',
]

// TO-DO/eventually:
// - Make import.meta.env work inside +config.js
//   - For it to work, we'll probably need the user to define the settings (e.g. `envDir`) for loadEnv() inside vike.config.js instead of vite.config.js
//   - Or stop using Vite's `mode` implementation and have Vike implement its own `mode` feature? (So that the only dependencies are `$ vike build --mode staging` and `$ MODE=staging vike build`.)

// === Rolldown filter
const skipIrrelevant = 'import.meta.env'
const filterRolldown = {
  /* We don't do that, because vike-react-sentry uses import.meta.env.PUBLIC_ENV__SENTRY_DSN
  id: {
    exclude: `**${'/node_modules/'}**`,
  },
  */
  code: {
    include: skipIrrelevant,
  },
}
const filterFunction = (code: string) => {
  if (!code.includes(skipIrrelevant)) return false
  return true
}
// ===

function pluginReplaceConstantsEnvVars(): Plugin[] {
  let envVarsAll: Record<string, string>
  let envPrefix: string[]
  let config: ResolvedConfig
  return [
    {
      name: 'vike:pluginReplaceConstantsEnvVars',
      // Correct order:
      // 1. @vitejs/plugin-vue
      // 2. vike:pluginExtractAssets and vike:pluginExtractExportNames [needs to be applied after @vitejs/plugin-vue]
      // 3. vike:pluginReplaceConstantsEnvVars [needs to be applied after vike:pluginExtractAssets and vike:pluginExtractExportNames]
      // 4. vite:define (Vite built-in plugin) [needs to be applied after vike:pluginReplaceConstantsEnvVars]
      enforce: 'post',
      configResolved: {
        handler(config_) {
          config = config_
          envVarsAll = loadEnv(config.mode, config.envDir || config.root, '')

          // Add process.env values defined by .env files
          Object.entries(envVarsAll).forEach(([key, val]) => (process.env[key] ??= val))

          envPrefix = getEnvPrefix(config)

          // See comment `Correct order` above
          ;(config.plugins as Plugin[]).sort(makeLast<Plugin>((plugin) => plugin.name === 'vite:define'))
        },
      },
      transform: {
        filter: filterRolldown,
        handler(code, id, options) {
          id = normalizeId(id)
          assertPosixPath(id)
          assert(filterFunction(code))

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

          // Replace bare `import.meta.env` expression with null
          // This prevents confusion when users do console.log(import.meta.env)
          // since Vite's replacement only includes built-in properties (DEV, PROD, SSR, MODE, BASE_URL)
          // but not PUBLIC_ENV__ variables that Vike handles
          // if (code.includes('BLA')) console.log(code)
          // `define: { 'import.meta.env': JSON.stringify(null) }` doesn't work because it also replaces `import.meta.env` inside `import.meta.env.SOME_VAR`
          const bareImportMetaEnvRegex = /\bimport\.meta\.env(?!\.)/g
          if (bareImportMetaEnvRegex.test(code)) {
            const modulePath = getFilePathToShowToUserModule(id, config)
            const warnMsg = `The expression ${pc.cyan('import.meta.env')} is used in ${modulePath}. This will be replaced with null. Use import.meta.env.PUBLIC_ENV__SOME_VAR / import.meta.env.SOME_VAR to access environment variables, see https://vike.dev/env`
            assertWarning(false, warnMsg, { onlyOnce: true })
            magicString.replaceAll(bareImportMetaEnvRegex, 'null')
          }

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
