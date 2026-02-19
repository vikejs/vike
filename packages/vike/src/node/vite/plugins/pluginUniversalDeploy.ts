import { addEntry } from '@universal-deploy/store'

export { pluginUniversalDeploy }

import type { Plugin } from 'vite'
import { VikeConfigInternal } from '../shared/resolveVikeConfigInternal.js'
import '../assertEnvVite.js'
import { catchAll, devServer } from '@universal-deploy/store/vite'
import { serverEntryVirtualId } from '@brillout/vite-plugin-server-entry/plugin'
import MagicString from 'magic-string'
import { escapeRegex } from '../../../utils/escapeRegex.js'

const catchAllRE = /^virtual:ud:catch-all$/

function pluginUniversalDeploy(vikeConfig: VikeConfigInternal): Plugin[] {
  return [
    {
      name: 'vike:pluginUniversalDeploy',
      config() {
        addEntry({
          id: 'vike/fetch',
          route: '/**',
        })
      },
    },
    ...pluginUniversalDeployServer(vikeConfig),
    catchAll(),
  ]
}

function pluginUniversalDeployServer(vikeConfig: VikeConfigInternal): Plugin[] {
  const serverConfig = vikeConfig._pageConfigGlobal.configValueSources.server?.[0]?.definedAt
  const vikeExtends = vikeConfig.config.extends
    ? Array.isArray(vikeConfig.config.extends)
      ? vikeConfig.config.extends
      : [vikeConfig.config.extends]
    : []
  if (serverConfig && 'filePathAbsoluteFilesystem' in serverConfig) {
    const serverPath = serverConfig['filePathAbsoluteFilesystem']

    // +server was also used by vike-server and vike-photon
    const vikeExtendsNames = new Set(vikeExtends.map((vikePlugin) => vikePlugin.name))
    if (vikeExtendsNames.has('vike-server') || vikeExtendsNames.has('vike-photon')) return []

    if (serverPath) {
      const filterRolldown = {
        id: {
          include: new RegExp(escapeRegex(serverPath)),
        },
      }

      return [
        {
          name: 'vike:pluginUniversalDeploy:server',
          resolveId: {
            order: 'pre',
            filter: {
              id: catchAllRE,
            },
            handler() {
              // Will resolve the entry from the users project root
              return this.resolve(serverPath)
            },
          },
        },
        {
          name: 'vike:pluginUniversalDeploy:serverEntry',
          apply: 'build',

          applyToEnvironment(env) {
            return env.config.consumer === 'server'
          },

          transform: {
            order: 'post',
            filter: filterRolldown,
            handler(code, id) {
              const ms = new MagicString(code)
              // Inject Vike virtual server entry
              ms.prepend(`import "${serverEntryVirtualId}";\n`)

              return {
                code: ms.toString(),
                map: ms.generateMap({
                  hires: true,
                  source: id,
                }),
              }
            },
          },

          sharedDuringBuild: true,
        },
        devServer(),
      ]
    }
  }

  return []
}
