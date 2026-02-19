import { addEntry } from '@universal-deploy/store'

export { pluginUniversalDeploy }

import type { Plugin } from 'vite'
import { VikeConfigInternal } from '../shared/resolveVikeConfigInternal.js'
import '../assertEnvVite.js'
import { catchAll } from '@universal-deploy/store/vite'

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
  if (serverConfig && 'filePathAbsoluteFilesystem' in serverConfig) {
    const serverPath = serverConfig['filePathAbsoluteFilesystem']

    if (serverPath) {
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
      ]
    }
  }

  return []
}
