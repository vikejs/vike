import MagicString from 'magic-string'

export { envVarsPlugin }

import type { Plugin, ResolvedConfig } from 'vite'
import { loadEnv } from 'vite'
import { assert, assertPosixPath, assertUsage, assertWarning, escapeRegex, isArray, lowerFirst } from '../utils.js'
import { getModuleFilePathAbsolute } from '../shared/getFilePath.js'
import { normalizeId } from '../shared/normalizeId.js'
import { isViteServerBuild_safe } from '../shared/isViteServerBuild.js'

// TODO/enventually: (after we implemented vike.config.js)
// - Make import.meta.env work inside +config.js
//   - For it to work, we'll probably need the user to define the settings (e.g. `envDir`) for loadEnv() inside vike.config.js instead of vite.config.js
//   - Or stop using Vite's `mode` implemention and have Vike implement its own `mode` feature? (So that the only dependencies are `$ vike build --mode staging` and `$ MODE=staging vike build`.)

const PUBLIC_ENV_PREFIX = 'PUBLIC_ENV__'
const PUBLIC_ENV_WHITELIST = [
  // https://github.com/vikejs/vike/issues/1724
  'STORYBOOK'
]

function envVarsPlugin(): Plugin {
  let envsAll: Record<string, string>
  let config: ResolvedConfig
  return {
    name: 'vike:envVars',
    enforce: 'post',
    configResolved(config_) {
      config = config_
      config.command
      envsAll = loadEnv(config.mode, config.envDir || config.root, '')
      // Vite's built-in plugin vite:define needs to apply after this plugin.
      //  - This plugin vike:env needs to apply after vike:extractAssets and vike:extractExportNames which need to apply after @vitejs/plugin-vue
      ;(config.plugins as Plugin[]).sort(lowerFirst<Plugin>((plugin) => (plugin.name === 'vite:define' ? 1 : 0)))
    },
    transform(code, id, options) {
      id = normalizeId(id)
      assertPosixPath(id)
      if (id.includes('/node_modules/')) return
      assertPosixPath(config.root)
      if (!id.startsWith(config.root)) return
      if (!code.includes('import.meta.env.')) return

      const isBuild = config.command === 'build'
      const isClientSide = !isViteServerBuild_safe(config, options)

      const s = new MagicString(code)

      let code3 = code

      Object.entries(envsAll)
        .filter(([key]) => {
          // Already handled by Vite
          const envPrefix = !config.envPrefix ? [] : isArray(config.envPrefix) ? config.envPrefix : [config.envPrefix]
          return !envPrefix.some((prefix) => key.startsWith(prefix))
        })
        .forEach(([envName, envVal]) => {
          const envStatement = `import.meta.env.${envName}` as const
          const envStatementRegEx = new RegExp(escapeRegex(envStatement) + '\\b', 'g')

          // Security check
          {
            const isPrivate = !envName.startsWith(PUBLIC_ENV_PREFIX) && !PUBLIC_ENV_WHITELIST.includes(envName)
            if (isPrivate && isClientSide) {
              if(envStatementRegEx.test(code)!==envStatementRegEx.test(code3)) {
                console.log('\n\n\n')
                console.log('code', code)
                console.log('\n\n\n')
                console.log('code3', code3)
                console.log('\n\n\n')
                console.log("code.includes('import.meta.env.SOME_OTHER_ENV')", code.includes('import.meta.env.SOME_OTHER_ENV'))
                console.log("code3.includes('import.meta.env.SOME_OTHER_ENV')", code3.includes('import.meta.env.SOME_OTHER_ENV'))
                console.log('envStatementRegEx.test(code)', envStatementRegEx.test(code))
                console.log('envStatementRegEx.test(code3)', envStatementRegEx.test(code3))
                console.log()
                console.log('2 envStatementRegEx.test(code)', new RegExp(escapeRegex(envStatement) + '\\b', 'g').test(code))
                console.log('2 envStatementRegEx.test(code3)', new RegExp(escapeRegex(envStatement) + '\\b', 'g').test(code3))
                const r = new RegExp(escapeRegex(envStatement) + '\\b', 'g')
                console.log()
                console.log('3 envStatementRegEx.test(code)', r.test(code))
                console.log('3 envStatementRegEx.test(code3)', r.test(code3))
                console.log('3 envStatementRegEx.test(code)', r.test(code))
                console.log()
                console.log('4 envStatementRegEx.test(code)', new RegExp(escapeRegex(envStatement) + '\\b', 'g').test(code))
                console.log('4 envStatementRegEx.test(code3)', new RegExp(escapeRegex(envStatement) + '\\b', 'g').test(code3))
                console.log()
                console.log('5 envStatementRegEx.test(code3)', r.test(code3))
                console.log('5 envStatementRegEx.test(code3)', r.test(code3))
                console.log('5 envStatementRegEx.test(code)', r.test(code))
                console.log('5 envStatementRegEx.test(code)', r.test(code))
                console.log()
                console.log('envStatementRegEx', envStatementRegEx)
                console.log()
                const str = 'import.meta.env.SOME_OTHER_ENV'
                // const r2 = new RegExp(escapeRegex('import.meta.env.SOME_OTHER_ENV') + '\\b', 'g')
                const r2 = new RegExp('import\.meta\.env\.SOME_OTHER_ENV\\b')
                console.log('r2.test(str)', r2.test(str))
                console.log('r2.test(str)', r2.test(str))
                console.log('r2.test(str)', r2.test(str))
                assert(false)
              }
              if (!envStatementRegEx.test(code)) return
              const modulePath = getModuleFilePathAbsolute(id, config)
              const errMsgAddendum: string = isBuild ? '' : ' (Vike will prevent your app from building for production)'
              const keyPublic = `${PUBLIC_ENV_PREFIX}${envName}` as const
              const errMsg =
                `${envStatement} is used in client-side file ${modulePath} which means that the environment variable ${envName} will be included in client-side bundles and, therefore, ${envName} will be publicly exposed which can be a security leak${errMsgAddendum}. Use ${envStatement} only in server-side files, or rename ${envName} to ${keyPublic}, see https://vike.dev/env` as const
              if (isBuild) {
                assertUsage(false, errMsg)
              } else {
                // - Only a warning for faster development DX (e.g. when user toggles `ssr: boolean` or `onBeforeRenderIsomorph: boolean`).
                // - But only showing a warning can be confusing: https://github.com/vikejs/vike/issues/1641
                assertWarning(false, errMsg, { onlyOnce: true })
              }
            }
            // Double check
            assert(!(isPrivate && isClientSide) || !isBuild)
          }

          // Apply
          applyEnvVar(s, envStatementRegEx, envVal)
          code3 = s.toString()
          // code = applyEnvVar2(envStatementRegEx, envVal, code)
        })

      // if (!s.hasChanged()) return

      // console.log('code 1', isClientSide, id, code)
      const code2 = s.toString()
      // console.log('code 2', isClientSide, id, code2)
      return {
        code: code2,
         map: s.generateMap({ hires: true, source: id })
      }
    }
  }
}

function applyEnvVar2(envStatementRegEx: RegExp, envVal: string, code: string) {
  return code.replace(envStatementRegEx, JSON.stringify(envVal))
}

function applyEnvVar(s: MagicString, envStatementRegEx: RegExp, envVal: string) {
  let match: RegExpExecArray | null
  while ((match = envStatementRegEx.exec(s.original))) {
    s.overwrite(match.index, match.index + match[0].length, JSON.stringify(envVal))
  }
}
