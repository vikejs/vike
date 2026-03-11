export { pluginUniversalDeploy }

import type { Plugin } from 'vite'
import { addEntry } from '@universal-deploy/store'
import universalDeploy from '@universal-deploy/vite'
import type { VikeConfigInternal } from '../shared/resolveVikeConfigInternal.js'
import { serverEntryVirtualId as vikeVirtualEntry } from '@brillout/vite-plugin-server-entry/plugin'
import { getMagicString } from '../shared/getMagicString.js'
import { escapeRegex } from '../../../utils/escapeRegex.js'
import { getDeployConfigs } from './pluginUniversalDeploy/getDeployConfigs.js'
import { assert, assertWarning } from '../../../utils/assert.js'
import pc from '@brillout/picocolors'
import '../assertEnvVite.js'

const virtualFileIdCatchAll = 'virtual:ud:catch-all'

function pluginUniversalDeploy(vikeConfig: VikeConfigInternal): Plugin[] {
  if (hasVikeServerOrVikePhoton(vikeConfig)) return []

  let serverEntryId: string
  let serverFilePath: string | null = null
  const serverConfig = vikeConfig.config.server
  if (serverConfig === false) return []
  const serverPlusFile = vikeConfig._pageConfigGlobal.configValueSources.server?.[0]
  if (serverPlusFile) {
    assert('filePathAbsoluteFilesystem' in serverPlusFile.definedAt)
    serverFilePath = serverPlusFile.definedAt.filePathAbsoluteFilesystem
    assert(serverFilePath)
    serverEntryId = serverFilePath
  } else {
    serverEntryId = virtualFileIdCatchAll
  }
  if (serverConfig !== true && !serverFilePath) return []
  const serverEntryVike = serverFilePath ?? 'vike/fetch'

  const plugins: Plugin[] = [
    ...universalDeploy(),
    {
      name: 'vike:pluginUniversalDeploy:entries',
      config() {
        for (const [pageId, page] of Object.entries(vikeConfig.pages)) {
          const deployConfigs = getDeployConfigs(pageId, page)
          if (deployConfigs !== null) {
            addEntry({
              id: serverEntryVike,
              ...deployConfigs,
            })
          }
        }
        // Default catch-all route
        addEntry({
          id: serverEntryVike,
          route: '/**',
        })
      },
      ...pluginCommon,
    },
    {
      name: 'vike:pluginUniversalDeploy:serverEntry',
      apply: 'build',
      transform: {
        order: 'post',
        filter: {
          id: {
            include: [serverEntryId],
          },
        },
        handler(code, id) {
          const { magicString, getMagicStringResult } = getMagicString(code, id)
          // Inject Vike virtual server entry
          magicString.prepend(`import "${vikeVirtualEntry}";\n`)
          return getMagicStringResult()
        },
      },
      ...pluginCommon,
    },
  ]

  if (serverFilePath) {
    plugins.push(
      // If +server.js is defined, make virtual:ud:catch-all resolve to +server.js absolute path
      {
        name: 'vike:pluginUniversalDeploy:server',
        resolveId: {
          order: 'pre',
          filter: {
            id: new RegExp(escapeRegex(serverFilePath)),
          },
          handler() {
            // Will resolve the entry from the users project root
            return this.resolve(serverFilePath)
          },
        },
        ...pluginCommon,
      },
    )
  }

  return plugins
}

const pluginCommon = {
  applyToEnvironment(env) {
    return env.config.consumer === 'server'
  },
  sharedDuringBuild: true,
} satisfies Partial<Plugin>

function hasVikeServerOrVikePhoton(vikeConfig: VikeConfigInternal) {
  const vikeExtendsNames = new Set(
    vikeConfig._extensions.map(
      (plusFile) => ('fileExportsByConfigName' in plusFile ? plusFile.fileExportsByConfigName : {}).name,
    ),
  )
  const vikeServerOrVikePhoton = vikeExtendsNames.has('vike-server')
    ? 'vike-server'
    : vikeExtendsNames.has('vike-photon')
      ? 'vike-photon'
      : null
  if (vikeServerOrVikePhoton) {
    assertWarning(
      false,
      `${pc.cyan(vikeServerOrVikePhoton)} is deprecated, see ${pc.underline('https://vike.dev/migration/universal-deploy')}`,
      { onlyOnce: true },
    )
    return true
  }
}
