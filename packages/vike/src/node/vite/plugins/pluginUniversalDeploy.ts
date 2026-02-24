export { pluginUniversalDeploy }

import type { Plugin } from 'vite'
import { addEntry } from '@universal-deploy/store'
import { getVikeConfigInternal, VikeConfigInternal } from '../shared/resolveVikeConfigInternal.js'
import '../assertEnvVite.js'
import { catchAll, devServer } from '@universal-deploy/store/vite'
import { serverEntryVirtualId } from '@brillout/vite-plugin-server-entry/plugin'
import MagicString from 'magic-string'
import { escapeRegex } from '../../../utils/escapeRegex.js'
import { pageConfigToUniversalDeploy } from './pluginUniversalDeploy/pageConfigToUniversalDeploy.js'

const catchAllRE = /^virtual:ud:catch-all$/

function pluginUniversalDeploy(vikeConfig: VikeConfigInternal): Plugin[] {
  return [
    {
      name: 'vike:pluginUniversalDeploy',
      async config() {
        const vikeConfig = await getVikeConfigInternal()

        for (const [pageId, page] of Object.entries(vikeConfig.pages)) {
          const additionalConfig = pageConfigToUniversalDeploy(pageId, page)

          if (additionalConfig !== null) {
            addEntry({
              id: 'vike/fetch',
              ...additionalConfig,
            })
          }
        }

        // Default catch-all route
        // TODO support multiple entry, at least where configs are different (mostly related to Vercel ISR)
        //  See https://github.com/vikejs/vike-photon/blob/438bffdb9a82650a49ee5345a82d0cc779afc3c8/packages/vike-photon/src/plugin/plugins/routes.ts#L22
        //  and https://github.com/vikejs/vike-photon/blob/438bffdb9a82650a49ee5345a82d0cc779afc3c8/packages/vike-photon/src/targets/vercel/index.ts#L8
        addEntry({
          id: 'vike/fetch',
          route: '/**',
        })
      },

      sharedDuringBuild: true,
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
  // TODO if target supporting UD are used, like vite-plugin-vercel@11, we should also install some of those plugins
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

          sharedDuringBuild: true,
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
